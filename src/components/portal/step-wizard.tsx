'use client';

import { useTranslations } from 'next-intl';
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Multi-step form wizard, ported from partials/public/step-wizard-script.blade.php:
 * - "Next" validates the current step's inputs/selects (native constraint validation) before moving on.
 * - Steps slide + fade (direction-aware in RTL), skipped when the user prefers reduced motion.
 * - jumpToFirstError() opens the step containing the first `.wafi-field-error` (after a server 422).
 *
 * Usage:
 *   <StepWizard total={3}>
 *     <WizardProgressText className="..." /> <WizardDots className="..." />
 *     <WizardStep index={0}>... <button type="button" onClick={next}>...</button></WizardStep>
 *   </StepWizard>
 * Inside steps, call useWizard() for next / prev.
 */

interface WizardApi {
  current: number;
  total: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  jumpToFirstError: () => void;
  register: (index: number, element: HTMLDivElement | null) => void;
  styleFor: (index: number) => CSSProperties | undefined;
}

const WizardContext = createContext<WizardApi | null>(null);

export function useWizard() {
  const api = useContext(WizardContext);
  if (!api) throw new Error('useWizard must be used inside <StepWizard>.');
  return api;
}

export function StepWizard({ total, initialStep = 0, children }: { total: number; initialStep?: number; children: ReactNode }) {
  const [current, setCurrent] = useState(initialStep);
  const [styles, setStyles] = useState<Record<number, CSSProperties>>({});
  const panels = useRef(new Map<number, HTMLDivElement>());
  const animating = useRef(false);
  const currentRef = useRef(initialStep);

  const register = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) panels.current.set(index, element);
    else panels.current.delete(index);
  }, []);

  const show = useCallback((index: number, direction: 0 | 1 | -1) => {
    const from = currentRef.current;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!direction || from === index || reduceMotion) {
      setStyles({});
      currentRef.current = index;
      setCurrent(index);
      return;
    }
    animating.current = true;
    // In RTL, "forward" reads right-to-left, so flip the slide axis to match.
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const sign = (isRtl ? -1 : 1) * direction;
    setStyles({ [from]: { transform: `translateX(${sign * -16}px)`, opacity: 0 } });
    window.setTimeout(() => {
      setStyles({ [index]: { transform: `translateX(${sign * 16}px)`, opacity: 0 } });
      currentRef.current = index;
      setCurrent(index);
      // Two frames: let the browser paint the start state before transitioning back to normal.
      requestAnimationFrame(() => requestAnimationFrame(() => setStyles({})));
      window.setTimeout(() => {
        animating.current = false;
      }, 200);
    }, 180);
  }, []);

  const next = useCallback(() => {
    if (animating.current) return;
    const panel = panels.current.get(currentRef.current);
    const inputs = panel ? Array.from(panel.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')) : [];
    const valid = inputs.every((input) => input.checkValidity());
    if (!valid) {
      inputs.forEach((input) => input.reportValidity());
      return;
    }
    if (currentRef.current < total - 1) show(currentRef.current + 1, 1);
  }, [show, total]);

  const prev = useCallback(() => {
    if (animating.current) return;
    if (currentRef.current > 0) show(currentRef.current - 1, -1);
  }, [show]);

  const goTo = useCallback((index: number) => show(index, 0), [show]);

  const jumpToFirstError = useCallback(() => {
    for (const [index, panel] of [...panels.current.entries()].sort((a, b) => a[0] - b[0])) {
      if (panel.querySelector('.wafi-field-error')) {
        show(index, 0);
        return;
      }
    }
  }, [show]);

  const api = useMemo<WizardApi>(
    () => ({ current, total, next, prev, goTo, jumpToFirstError, register, styleFor: (index) => styles[index] }),
    [current, total, next, prev, goTo, jumpToFirstError, register, styles],
  );

  return <WizardContext.Provider value={api}>{children}</WizardContext.Provider>;
}

/** One step panel (the old `.step` div). Hidden unless current; stays mounted so its inputs are submitted. */
export function WizardStep({ index, id, className = '', children }: { index: number; id?: string; className?: string; children: ReactNode }) {
  const { current, register, styleFor } = useWizard();
  const ref = useCallback((element: HTMLDivElement | null) => register(index, element), [index, register]);
  return (
    <div ref={ref} id={id} className={`step wafi-step-transition ${current === index ? '' : 'hidden'} ${className}`.trim()} style={styleFor(index)}>
      {children}
    </div>
  );
}

/** Progress dots (the old #stepDots). */
export function WizardDots({ className }: { className?: string }) {
  const { current, total } = useWizard();
  return (
    <div className={className}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= current ? 'bg-brand-600' : 'bg-slate-200'}`} style={{ width: '1.5rem' }} />
      ))}
    </div>
  );
}

/** "Step X of Y" (the old #progressText). */
export function WizardProgressText({ className }: { className?: string }) {
  const { current, total } = useWizard();
  const t = useTranslations('Portal');
  return <span className={className}>{t('step_of', { current: current + 1, total })}</span>;
}

/** Scrolls the wizard to the first field error after the server returns validation errors. */
export function useJumpToFirstErrorOn(trigger: unknown) {
  const { jumpToFirstError } = useWizard();
  useEffect(() => {
    if (trigger) jumpToFirstError();
  }, [trigger, jumpToFirstError]);
}

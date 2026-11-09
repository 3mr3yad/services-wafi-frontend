'use client';

import { createElement, Fragment, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode, RefObject } from 'react';

/** Custom CSS properties used inline by the original markup (--d, --ry, --pd, --i ...). */
export type CssVars = CSSProperties & Record<`--${string}`, string | number>;

const FORM_DOCK_EVENT = 'wafi:open-form';

/** Opens the floating warranty form (FormDock) from anywhere on the page. */
export function openFormDock() {
  window.dispatchEvent(new CustomEvent(FORM_DOCK_EVENT));
}

export function useFormDockEvent(onOpen: () => void) {
  const handler = useRef(onOpen);
  useEffect(() => {
    handler.current = onOpen;
  });
  useEffect(() => {
    const listener = () => handler.current();
    window.addEventListener(FORM_DOCK_EVENT, listener);
    return () => window.removeEventListener(FORM_DOCK_EVENT, listener);
  }, []);
}

/** Becomes true once the element enters the viewport (or was scrolled past). */
export function useReveal<T extends Element>(options?: { amount?: number; margin?: string }): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const amount = options?.amount ?? 0;
  const margin = options?.margin ?? '0px 0px -8% 0px';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && (entry.isIntersecting || entry.boundingClientRect.bottom < 0)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, margin]);

  return [ref, inView];
}

type RevealTag = 'div' | 'p' | 'h2' | 'li' | 'article';

/** Fades/slides its content in when scrolled into view (.r → .r.in). */
export function Reveal({
  as = 'div',
  className,
  delay = 0,
  y = 40,
  children,
}: {
  as?: RevealTag;
  className?: string;
  delay?: number;
  y?: number;
  children: ReactNode;
}) {
  const [ref, inView] = useReveal<HTMLElement>();
  const style: CssVars = { '--d': `${delay}s`, '--ry': `${y}px` };
  return createElement(as, { ref, className: [className, 'r', inView ? 'in' : ''].filter(Boolean).join(' '), style }, children);
}

/** Word-by-word reveal used by the about headline. */
export function Words({ text, className, accentLast = false }: { text: string; className?: string; accentLast?: boolean }) {
  const [ref, inView] = useReveal<HTMLSpanElement>({ amount: 0.25, margin: '0px 0px -12% 0px' });
  const words = text.split(' ');
  return (
    <span ref={ref} className={[className, inView ? 'words-in' : ''].filter(Boolean).join(' ')}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="reveal-line">
            <span
              className={'reveal-word' + (accentLast && i === words.length - 1 ? ' is-accent' : '')}
              style={{ '--d': `${i * 0.06}s` } as CssVars}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

/** Stat number that "decodes" its digits in random order once visible. */
export function Counter({ to, suffix = '' }: { to: string; suffix?: string }) {
  const [ref, inView] = useReveal<HTMLSpanElement>({ amount: 0.5 });
  const [display, setDisplay] = useState(() => '0'.repeat(to.length));
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const order = to.split('').map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = order[i] ?? 0;
      order[i] = order[j] ?? 0;
      order[j] = a;
    }
    const rank: number[] = Array.from({ length: order.length }, () => 0);
    order.forEach((digitIndex, r) => {
      rank[digitIndex] = r;
    });
    const total = 550 + (order.length - 1) * 280 + 120;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - startedAt;
      let text = '';
      let done = true;
      for (let i = 0; i < to.length; i++) {
        if (elapsed >= 550 + 280 * (rank[i] ?? 0)) text += to[i] ?? '';
        else {
          text += Math.floor(Math.random() * 10).toString();
          done = false;
        }
      }
      setDisplay(text);
      if (!done || elapsed < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to]);

  return (
    <span className="stat__value" ref={ref}>
      <span dir="ltr" className="stat__value-digits">
        {display}
      </span>
      <em>{suffix}</em>
    </span>
  );
}

/** Pulls its child slightly towards the mouse pointer. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      data-magnetic="true"
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
        el.style.transform = `translate(${x}px,${y}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = '';
      }}
      style={{ display: 'inline-flex', transition: 'transform .35s cubic-bezier(.6,.01,.05,.95)' }}
    >
      {children}
    </span>
  );
}

/** Keeps an element mounted during its exit animation (stand-in for framer-motion's AnimatePresence). */
export function usePresence(open: boolean, exitMs = 400): { mounted: boolean; leaving: boolean } {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitMs]);

  return { mounted: mounted || open, leaving: mounted && !open };
}

/** Tilts an element towards the pointer (holo stage, warranty preview card). */
export function useTilt<T extends HTMLElement>(transform: (x: number, y: number) => string) {
  const ref = useRef<T>(null);
  const onMouseMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = transform(x, y);
  };
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return { ref, onMouseMove, onMouseLeave };
}

'use client';

import { useTranslations } from 'next-intl';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Full-screen "sending your request" loader, in the protection page's preloader style (pulsing logo, thin glowing
 * bar, % count). Shown while a form is being submitted: it covers the whole page, so nothing can be clicked or
 * submitted again until the backend answers. Upload progress isn't observable through a Server Action, so the bar
 * creeps towards 92% and jumps to 100% when `open` turns false, then fades out.
 */
export function SubmitOverlay({
  open,
  logo,
  accent = '#28B0E8',
  container,
}: {
  open: boolean;
  /** Brand mark in the middle; defaults to the عالم وافي logo. */
  logo?: ReactNode;
  /** Bar / glow colour. */
  accent?: string;
  /** CSS selector of the element to render into (so page-scoped styles/fonts apply); defaults to <body>. */
  container?: string;
}) {
  const t = useTranslations('Portal');
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  // Open: show, restart the bar and let it creep. Close: fill to 100%, then fade out.
  useEffect(() => {
    if (open) {
      const start = window.setTimeout(() => {
        setVisible(true);
        setLeaving(false);
        setProgress(4);
      }, 0);
      const creep = window.setInterval(() => setProgress((value) => Math.min(92, value + Math.max(0.4, (92 - value) * 0.06))), 140);
      return () => {
        window.clearTimeout(start);
        window.clearInterval(creep);
      };
    }
    const finish = window.setTimeout(() => {
      setProgress(100);
      setLeaving(true);
    }, 0);
    const hide = window.setTimeout(() => setVisible(false), 450);
    return () => {
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, [open]);

  // While visible: lock page scroll and pull focus off the form (so Enter can't resubmit).
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  if (!visible) return null;

  const value = Math.round(progress);
  return createPortal(
    <div
      ref={panel}
      tabIndex={-1}
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-label={t('submitting_title')}
      style={{ '--so-accent': accent } as CSSProperties}
      className={`submit-overlay fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0B0E14]/95 px-6 text-center outline-none backdrop-blur-md transition-opacity duration-400 ${leaving ? 'opacity-0' : 'opacity-100'}`}
      onKeyDown={(event) => {
        if (event.key === 'Tab') event.preventDefault();
      }}
    >
      <span className="submit-overlay__glow pointer-events-none absolute aspect-square w-[min(420px,80vw)] rounded-full blur-[6px]" />
      <div className="submit-overlay__logo relative">
        {logo ?? <img src="/images/logo.png" alt="" className="h-auto w-[min(200px,50vw)]" />}
      </div>
      <div className="relative mt-9 flex flex-col items-center gap-3">
        <div className="h-[2px] w-[min(200px,50vw)] overflow-hidden rounded-sm bg-white/10">
          <span
            className="block h-full transition-[width] duration-150 ease-linear"
            style={{ width: `${value}%`, background: 'var(--so-accent)', boxShadow: '0 0 10px var(--so-accent)' }}
          />
        </div>
        <div className="flex gap-0.5 text-xs tracking-[0.14em] text-white/60" dir="ltr">
          <span>{value}</span>
          <i className="not-italic" style={{ color: 'var(--so-accent)' }}>%</i>
        </div>
      </div>
      <p className="relative mt-6 text-base font-bold text-white" role="status" aria-live="polite">
        {t('submitting_title')}
      </p>
      <p className="relative mt-1.5 max-w-xs text-sm text-white/55">{t('submitting_hint')}</p>
      <style>{`
        .submit-overlay__glow { background: radial-gradient(circle, color-mix(in srgb, var(--so-accent) 18%, transparent), transparent 70%); }
        @media (prefers-reduced-motion: no-preference) {
          .submit-overlay__glow, .submit-overlay__logo { animation: submit-overlay-pulse 2.4s ease-in-out infinite; }
        }
        @keyframes submit-overlay-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .88; transform: scale(1.04); } }
      `}</style>
    </div>,
    (container ? document.querySelector(container) : null) ?? document.body,
  );
}

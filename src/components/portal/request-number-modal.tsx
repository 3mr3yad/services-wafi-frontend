'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AfterReveal, RevealNumber, SuccessMark } from '@/components/shared/success-celebration';

interface RequestNumberModalProps {
  /** Shown when set; null hides the modal. */
  requestNumber: string | null;
  onClose: () => void;
  /** Defaults to Portal.request_number_hint (same as the old partial's $hintMessage). */
  hintMessage?: string;
}

/** "Your request number" success modal (partials/public/request-number-modal.blade.php) with a success animation. */
export function RequestNumberModal({ requestNumber, onClose, hintMessage }: RequestNumberModalProps) {
  const t = useTranslations('Portal');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!requestNumber) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [requestNumber, onClose]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!requestNumber) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(requestNumber);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context / permissions): the number is still selectable.
    }
  };

  return (
    <div className="fixed inset-0 z-50" aria-hidden="false" role="dialog" aria-modal="true" aria-labelledby="request-number-title">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="wafi-animate-pop relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('ok')}
            className="absolute end-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>

          <div className="relative bg-gradient-to-b from-brand-50 to-white px-6 pt-9 pb-2 text-center">
            <SuccessMark accent="var(--color-brand-600)" />
            <AfterReveal delay={0.85}>
              <h2 id="request-number-title" className="mt-5 text-xl font-extrabold text-slate-900">
                {t('success_title')}
              </h2>
            </AfterReveal>
          </div>

          <div className="px-6 pt-3 pb-6 text-center">
            <AfterReveal delay={0.9}>
              <div className="text-sm text-slate-500">{hintMessage ?? t('request_number_hint')}</div>
            </AfterReveal>
            <div className="mt-4 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 px-4 py-4">
              <div className="text-xs font-bold text-slate-500">{t('request_number_title')}</div>
              <RevealNumber value={requestNumber} className="mt-1 block text-4xl font-extrabold tracking-tight text-brand-700 select-all" />
              <AfterReveal delay={0.95 + requestNumber.length * 0.07}>
                <button
                  type="button"
                  onClick={copy}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                    {copied ? <path d="M20 6 9 17l-5-5" /> : <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>}
                  </svg>
                  <span aria-live="polite">{copied ? t('copied') : t('copy')}</span>
                </button>
              </AfterReveal>
            </div>
            <AfterReveal delay={1.2 + requestNumber.length * 0.07}>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white transition hover:bg-brand-700"
              >
                {t('ok')}
              </button>
            </AfterReveal>
          </div>
        </div>
      </div>
    </div>
  );
}

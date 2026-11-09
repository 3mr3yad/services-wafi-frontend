'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface RequestNumberModalProps {
  /** Shown when set; null hides the modal. */
  requestNumber: string | null;
  onClose: () => void;
  /** Defaults to Portal.request_number_hint (same as the old partial's $hintMessage). */
  hintMessage?: string;
}

/** "Your request number" success modal, ported from partials/public/request-number-modal.blade.php. */
export function RequestNumberModal({ requestNumber, onClose, hintMessage }: RequestNumberModalProps) {
  const t = useTranslations('Portal');

  useEffect(() => {
    if (!requestNumber) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [requestNumber, onClose]);

  if (!requestNumber) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden="false" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="wafi-animate-pop w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="font-bold">{t('request_number_title')}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
          <div className="px-6 py-6 text-center">
            <div className="text-sm text-slate-500">{hintMessage ?? t('request_number_hint')}</div>
            <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-4 text-3xl font-extrabold tracking-tight text-slate-900">
              {requestNumber}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white transition hover:bg-brand-700"
            >
              {t('ok')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

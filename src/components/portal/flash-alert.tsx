'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface FlashAlertProps {
  /** Success message (session('success') in the old site). Auto-hides after 6s. */
  success?: string | null;
  /** All error messages to list (Laravel $errors->all()). */
  errors?: string[];
}

/** Success / error banner, ported from partials/public/flash-alert.blade.php. */
export function FlashAlert({ success, errors = [] }: FlashAlertProps) {
  const t = useTranslations('Portal');
  const [hiddenSuccess, setHiddenSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setHiddenSuccess(success), 6000);
    return () => window.clearTimeout(timer);
  }, [success]);

  return (
    <>
      {success && hiddenSuccess !== success && (
        <div className="wafi-animate-in mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-emerald-800 shadow-sm">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div>
            <div className="font-bold text-emerald-900">{t('success_title')}</div>
            <div className="text-sm text-emerald-700">{success}</div>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="wafi-animate-in mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-rose-800 shadow-sm" role="alert">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
          </span>
          <div>
            <div className="font-bold text-rose-900">{t('error_title')}</div>
            {errors.length === 1 ? (
              <div className="text-sm text-rose-700">{errors[0]}</div>
            ) : (
              <ul className="mt-1 list-disc space-y-0.5 ps-4 text-sm text-rose-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { TERMS_PDF_URL } from './terms';

/** Ported from partials/public/xleader-terms-checkbox.blade.php. */
export function XleaderTermsCheckbox({ onOpenTerms, error }: { onOpenTerms: () => void; error?: string }) {
  const t = useTranslations('Xleader');
  return (
    <div className="mt-2 sm:col-span-2">
      <label className="flex cursor-pointer items-start gap-2.5 select-none">
        <input
          type="checkbox"
          name="terms_accepted"
          value="1"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 bg-slate-50 text-brand-600 focus:ring-brand-500/40 focus:ring-offset-0"
        />
        <span className="text-sm text-slate-600">
          {t('terms_checkbox_prefix')}{' '}
          <a
            href={TERMS_PDF_URL}
            onClick={(event) => {
              event.preventDefault();
              onOpenTerms();
            }}
            className="font-semibold text-brand-600 underline hover:text-brand-700"
          >
            {t('terms_link_label')}
          </a>
        </span>
      </label>
      {error && <div className="wafi-field-error mt-1.5 text-xs text-red-600">{error}</div>}
    </div>
  );
}

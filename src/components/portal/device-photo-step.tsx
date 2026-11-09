'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { useWizard, WizardStep } from './step-wizard';

const FIELDS = ['screen', 'back', 'right_edge', 'left_edge', 'top', 'bottom'] as const;

// Full class strings (Tailwind can't see classes built at runtime like `text-${accent}-700`).
const ACCENT = {
  brand: {
    title: 'text-brand-700',
    hover: 'hover:border-brand-400 hover:bg-brand-50',
    icon: 'group-hover:text-brand-600',
    submit: 'bg-brand-600 hover:bg-brand-700',
  },
  accent: {
    title: 'text-accent-700',
    hover: 'hover:border-accent-400 hover:bg-accent-50',
    icon: 'group-hover:text-accent-600',
    submit: 'bg-accent-500 hover:bg-accent-600',
  },
} as const;

interface DevicePhotoStepProps {
  index: number;
  accent?: keyof typeof ACCENT;
  batteryLabel?: string;
  /** Field errors from the backend, keyed like "device_images.screen". */
  errors?: Record<string, string[]>;
  /** Optional slot before the buttons (only Xleader uses it, for the terms checkbox). */
  extraBeforeSubmit?: ReactNode;
  submitting?: boolean;
}

function PhotoInput({ field, label, accent, error }: { field: string; label: string; accent: keyof typeof ACCENT; error?: string }) {
  const t = useTranslations('Portal');
  const [fileName, setFileName] = useState<string | null>(null);
  const a = ACCENT[accent];
  return (
    <>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <label
        className={`device-photo-input group flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-3 py-3 transition ${a.hover}`}
      >
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 ${a.icon}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="m21 15-5-5L5 21" />
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
          </svg>
        </span>
        <span className="min-w-0 truncate text-xs font-semibold text-slate-500">{fileName ?? t('choose')}</span>
        <input
          type="file"
          name={`device_images[${field}]`}
          accept="image/*"
          capture="environment"
          required
          className="sr-only"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
      </label>
      {error && <div className="wafi-field-error mt-1.5 text-xs text-red-600">{error}</div>}
    </>
  );
}

/** Device photos step (6 sides + battery), ported from partials/public/device-photo-step.blade.php. */
export function DevicePhotoStep({ index, accent = 'brand', batteryLabel, errors = {}, extraBeforeSubmit, submitting }: DevicePhotoStepProps) {
  const t = useTranslations('Portal');
  const { prev } = useWizard();
  const a = ACCENT[accent];

  return (
    <WizardStep index={index} id={`step${index}`}>
      <p className={`mb-1 text-lg font-extrabold ${a.title}`}>{t('device_photos.step_title')}</p>
      <p className="mb-4 text-sm text-slate-500">{t('device_photos.step_subtitle')}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field}>
            <PhotoInput field={field} label={t(`device_photos.${field}`)} accent={accent} error={errors[`device_images.${field}`]?.[0]} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <PhotoInput field="battery" label={batteryLabel ?? t('device_photos.battery')} accent={accent} error={errors['device_images.battery']?.[0]} />
        </div>
      </div>

      {extraBeforeSubmit}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={prev}
          className="prev wafi-arrow-btn inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 ltr:rotate-180">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t('previous')}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`wafi-arrow-btn inline-flex items-center gap-1.5 rounded-full px-7 py-3 font-extrabold text-white transition disabled:cursor-progress disabled:opacity-70 ${a.submit}`}
        >
          {t('submit')}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 rtl:rotate-180">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
      </div>
    </WizardStep>
  );
}

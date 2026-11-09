'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, useRef, useState, useTransition } from 'react';
import { PhoneInput, type PhoneInputHandle } from '@/components/portal';
import { lookupSupportRequest, rateSupportRequest } from '../api/actions';
import type { LookupResult } from '../api/schemas';

// Full class strings per status color (same map as the old inline script).
const COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  slate: 'bg-slate-200 text-slate-700',
  teal: 'bg-teal-100 text-teal-700',
  pink: 'bg-pink-100 text-pink-700',
};
const DEFAULT_COLOR = 'bg-slate-200 text-slate-700';

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z';
const IMAGE_REGEX = /\.(jpe?g|png|webp|gif)$/i;

/** Panel B of the old page: lookup by phone (latest ticket) + CSAT stars. */
export function TrackRequestPanel({ hidden }: { hidden: boolean }) {
  const t = useTranslations('CustomerSupport');
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [phone, setPhone] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(0);
  const [thanks, setThanks] = useState(false);
  const [rateNotice, setRateNotice] = useState(false);
  const [pending, startTransition] = useTransition();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const value = await phoneRef.current?.validate();
    if (!value) return;

    setNotFound(false);
    setResult(null);
    startTransition(async () => {
      const outcome = await lookupSupportRequest(value);
      if (!outcome.ok) {
        setNotFound(true);
        return;
      }
      setPhone(value);
      setRating(outcome.result.rating ?? 0);
      setThanks(false);
      setRateNotice(false);
      setResult(outcome.result);
    });
  };

  const submitRating = async (value: number) => {
    if (!result) return;
    const outcome = await rateSupportRequest({ phone, request_number: result.request_number, rating: value });
    if (outcome.status === 'success') {
      setRating(outcome.rating);
      setThanks(true);
      setRateNotice(false);
    } else if (outcome.status === 'not_configured') {
      setRateNotice(true);
    }
    // Other failures stay silent, as on the old page (rating is a nice-to-have).
  };

  return (
    <section id="trackRequestPanel" className={hidden ? 'mt-6 hidden wafi-animate-in' : 'mt-6 wafi-animate-in'}>
      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm p-7 sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-900">{t('lookup_title')}</h2>
        <p className="text-xs text-slate-400 mt-1.5">{t('lookup_hint')}</p>
        <form id="lookupForm" onSubmit={onSubmit} className="mt-5 space-y-3" aria-busy={pending}>
          <PhoneInput
            ref={phoneRef}
            name="phone"
            id="lookupPhone"
            className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-4 focus:ring-accent-500/15 focus:border-accent-400"
            required
            errorId="lookupPhoneClientError"
          />
          <div id="lookupPhoneClientError" className="hidden text-xs text-rose-600">
            {t('phone_invalid')}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center rounded-2xl bg-accent-500 hover:bg-accent-400 px-5 py-3 text-sm font-extrabold text-ink-950 transition disabled:opacity-70"
          >
            {t('lookup_button')}
          </button>
        </form>
        {notFound && <div className="mt-3 text-xs text-rose-600">{t('lookup_not_found')}</div>}

        {result && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-dashed border-slate-200">
              <span className="text-xs text-slate-400">{t('lookup_title')}</span>
              <span className="text-lg font-extrabold text-slate-900">{result.request_number}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 py-1.5">
              <span className="text-sm text-slate-500">{t('lookup_status_label')}</span>
              <span className="flex items-center gap-1.5">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${COLOR_CLASSES[result.status?.color ?? ''] ?? DEFAULT_COLOR}`}>
                  {result.status ? result.status.name : '—'}
                </span>
                {result.closed && (
                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold bg-slate-200 text-slate-600">{t('closed_badge_label')}</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-sm text-slate-500">{t('lookup_department_label')}</span>
              <span className="text-sm font-bold text-slate-900">{result.department ? result.department.name : '—'}</span>
            </div>
            <div className="pt-2">
              <span className="text-sm text-slate-500">{t('lookup_action_taken_label')}</span>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed">{result.action_taken || t('lookup_no_action_yet')}</p>
            </div>
            {result.attachments.length > 0 && (
              <div className="pt-3 mt-2 border-t border-dashed border-slate-200">
                <span className="text-sm text-slate-500">{t('lookup_attachments_label')}</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {result.attachments.map((attachment, index) =>
                    IMAGE_REGEX.test(attachment.original_filename || attachment.url || '') ? (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener"
                        className="block rounded-xl overflow-hidden border border-slate-200 hover:border-accent-400/50 transition"
                      >
                        <img src={attachment.url} alt={attachment.original_filename ?? ''} className="h-20 w-full object-cover" />
                      </a>
                    ) : (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener"
                        className="block rounded-xl overflow-hidden border border-slate-200 hover:border-accent-400/50 transition h-20 flex flex-col items-center justify-center gap-1 bg-slate-50 px-1 text-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-slate-400">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                        </svg>
                        <span className="text-[10px] text-slate-500 truncate w-full">{attachment.original_filename ?? ''}</span>
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}
            <div className="pt-3 mt-2 border-t border-dashed border-slate-200">
              <span className="text-sm text-slate-500">{t('rate_label')}</span>
              <div className="mt-2 flex items-center gap-1" dir="ltr">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" className="transition hover:scale-110" aria-label={String(value)} onClick={() => void submitRating(value)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7" fill={value <= rating ? '#fbbf24' : 'none'} stroke="#fbbf24" strokeWidth="1.5">
                      <path d={STAR_PATH} />
                    </svg>
                  </button>
                ))}
              </div>
              {thanks && <p className="mt-1.5 text-xs text-emerald-600">{t('rate_thanks')}</p>}
              {rateNotice && <p className="mt-1.5 text-xs text-slate-500">{t('rate_unavailable')}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

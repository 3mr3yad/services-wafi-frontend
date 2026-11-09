'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, useCallback, useRef, useState } from 'react';
import { PhoneInput, type PhoneInputHandle } from '@/components/portal';
import { lookupXleaderWarranty } from '../api/xleader.actions';
import type { XleaderLookupRecord } from '../api/schemas';
import { useEscape } from './use-escape';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}

/** Warranty lookup result modal (old #lookupModal). */
function LookupModal({ record, onClose }: { record: XleaderLookupRecord | null; onClose: () => void }) {
  const t = useTranslations('Xleader');
  useEscape(record !== null, onClose);
  if (!record) return null;

  const device = [record.brand, record.model].filter(Boolean).join(' - ');

  return (
    <div className="fixed inset-0 z-50" aria-hidden="false" role="dialog" aria-modal="true" aria-labelledby="lookupModalTitle">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="wafi-animate-pop w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span className="font-bold" id="lookupModalTitle">
                  {t('lookup_result_title')}
                </span>
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
          <div className="px-6 py-6">
            <Row label={t('lookup_customer_name')} value={record.customerName} />
            <Row label={t('lookup_customer_phone')} value={record.customerPhone} />
            <Row label={t('lookup_device')} value={device} />
            <Row label={t('lookup_warranty_period')} value={t('lookup_warranty_from_to', { start: record.warrantyStart, end: record.warrantyEnd })} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Check your warranty" box in the intro card (old #lookupForm + inline script). */
export function WarrantyLookup() {
  const t = useTranslations('Xleader');
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [notFound, setNotFound] = useState(false);
  const [pending, setPending] = useState(false);
  const [record, setRecord] = useState<XleaderLookupRecord | null>(null);
  const close = useCallback(() => setRecord(null), []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const phone = await phoneRef.current?.validate();
    if (!phone) return;
    setNotFound(false);
    setPending(true);
    try {
      const result = await lookupXleaderWarranty(phone);
      if (result.status === 'found') setRecord(result.record);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <LookupModal record={record} onClose={close} />
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-bold text-slate-700">{t('lookup_title')}</div>
        <form id="lookupForm" className="mt-3 space-y-2" onSubmit={onSubmit}>
          <PhoneInput
            ref={phoneRef}
            name="lookup_phone"
            id="lookupInput"
            errorId="lookupPhoneClientError"
            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
            required
          />
          <div id="lookupPhoneClientError" className="hidden text-xs text-rose-600">
            {t('phone_invalid')}
          </div>
          <button
            type="submit"
            id="lookupSubmit"
            className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            {t('lookup_button')}
          </button>
        </form>
        {notFound && <div className="mt-2 text-xs text-rose-600">{t('lookup_not_found')}</div>}
      </div>
    </>
  );
}

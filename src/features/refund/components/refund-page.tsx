'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, type MouseEvent, type ReactNode, useCallback, useRef, useState } from 'react';
import { FlashAlert, PhoneInput, type PhoneInputHandle, RequestNumberModal } from '@/components/portal';
import { lookupRefundRequest, submitRefundRequest } from '../api/refund.actions';
import type { RefundLookupRecord } from '../api/schemas';
import { RefundLookupModal } from './refund-lookup-modal';
import { RefundTermsModal } from './refund-terms-modal';

const FIELD_CLASS =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-4 focus:ring-brand-700/10 focus:border-brand-600 focus:bg-white';
const LABEL_CLASS = 'block text-sm font-bold text-slate-700 mb-2';
const PRESET_DURATIONS = [6, 12, 18, 24, 30, 36];
const FINANCE_COMPANIES = [
  { value: 'mora', label: 'مورا' },
  { value: 'akwara', label: 'كوارا' },
  { value: 'tamam', label: 'تمام' },
];

type FieldErrors = Record<string, string[]>;

function FieldError({ errors, field }: { errors: FieldErrors; field: string }) {
  const message = errors[field]?.[0];
  return message ? <div className="wafi-field-error mt-1.5 text-xs text-red-600">{message}</div> : null;
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 rtl:rotate-180">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

/** The voucher cancellation page (old resources/views/refund.blade.php). */
export function RefundPage() {
  const t = useTranslations('Refund');
  const tp = useTranslations('Portal');

  const [termsOpen, setTermsOpen] = useState(false);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ success: string | null; errors: string[] }>({ success: null, errors: [] });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const openTerms = (event: MouseEvent) => {
    event.preventDefault();
    setTermsOpen(true);
  };
  const closeTerms = useCallback(() => setTermsOpen(false), []);
  const closeRequestNumber = useCallback(() => setRequestNumber(null), []);

  // ---- Request form ----
  const formRef = useRef<HTMLFormElement>(null);
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [formKey, setFormKey] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [durationOther, setDurationOther] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Same rule as the old checkFormValidity(): every visible required field filled + terms accepted.
  const checkFormValidity = () => {
    const form = formRef.current;
    if (!form) return;
    const allFilled = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-required]')).every((field) => {
      if (field.closest('.hidden')) return true;
      return Boolean(field.value);
    });
    const phoneFilled = Boolean(form.querySelector<HTMLInputElement>('#refundPhone')?.value);
    const agreed = form.querySelector<HTMLInputElement>('#agreeTerms')?.checked === true;
    setCanSubmit(allFilled && phoneFilled && agreed);
  };

  const resetForm = () => {
    setFormKey((key) => key + 1);
    setCanSubmit(false);
    setDurationOther(false);
    setFileName(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;

    const phone = await phoneRef.current?.validate();
    if (!phone) return;

    setSubmitting(true);
    try {
      const result = await submitRefundRequest(new FormData(form));
      if (result.status === 'success') {
        setFieldErrors({});
        setFlash({ success: result.data.data.message ?? t('submit_success'), errors: [] });
        setRequestNumber(result.data.data.request_number);
        resetForm();
      } else if (result.status === 'invalid') {
        setFieldErrors(result.errors);
        const all = Object.values(result.errors).flat();
        setFlash({ success: null, errors: all.length > 0 ? all : [result.message || tp('error_hint')] });
      } else {
        setFieldErrors({});
        const message = result.kind === 'not_configured' ? t('submit_not_available') : (result.message ?? t('submit_error'));
        setFlash({ success: null, errors: [message] });
      }
    } catch {
      setFlash({ success: null, errors: [t('submit_error')] });
    } finally {
      setSubmitting(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---- Status lookup ----
  const lookupPhoneRef = useRef<PhoneInputHandle>(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);
  const [lookupRecord, setLookupRecord] = useState<RefundLookupRecord | null>(null);
  const closeLookup = useCallback(() => setLookupRecord(null), []);

  const onLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = await lookupPhoneRef.current?.validate();
    if (!phone) return;
    setLookupNotFound(false);
    try {
      const result = await lookupRefundRequest(phone);
      if (result.status === 'found') setLookupRecord(result.record);
      else setLookupNotFound(true);
    } catch {
      setLookupNotFound(true);
    }
  };

  const field = (name: string, label: string, input: ReactNode, wide = false) => (
    <div className={wide ? 'md:col-span-2' : undefined}>
      <label className={LABEL_CLASS}>{label}</label>
      {input}
      <FieldError errors={fieldErrors} field={name} />
    </div>
  );

  return (
    <>
      <RequestNumberModal requestNumber={requestNumber} onClose={closeRequestNumber} />
      <RefundTermsModal open={termsOpen} onClose={closeTerms} />
      <RefundLookupModal record={lookupRecord} onClose={closeLookup} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <FlashAlert success={flash.success} errors={flash.errors} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          <section className="lg:col-span-2" data-reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8 lg:sticky lg:top-24">
              <div className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-brand-200/30 blur-[80px]" />
              <div className="absolute -bottom-20 -start-10 h-56 w-56 rounded-full bg-accent-200/25 blur-[80px]" />

              <div className="relative">
                <span className="text-6xl leading-none font-black text-slate-100">01</span>
                <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M9 12h6M12 9v6M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t('title')}</h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('intro')}</p>

                <a
                  href="#"
                  onClick={openTerms}
                  className="wafi-arrow-btn group mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900">{t('terms_title')}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{t('terms_hint')}</span>
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="h-4 w-4 shrink-0 text-slate-300 rtl:rotate-180"
                  >
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </a>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-700">{t('lookup_title')}</div>
                  <form id="lookupForm" className="mt-3 space-y-2" onSubmit={onLookup}>
                    <PhoneInput
                      ref={lookupPhoneRef}
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
                      className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
                    >
                      {t('lookup_button')}
                    </button>
                  </form>
                  {lookupNotFound ? <div className="mt-2 text-xs text-rose-600">{t('lookup_not_found')}</div> : null}
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-3" data-reveal>
            <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-7 sm:p-8">
                <h2 className="text-xl font-extrabold text-slate-900">{t('form_title')}</h2>
                <p className="mt-1.5 text-sm text-slate-500">{t('form_subtitle')}</p>
              </div>

              <form
                key={formKey}
                ref={formRef}
                id="financeForm"
                encType="multipart/form-data"
                className="p-7 sm:p-8"
                onSubmit={onSubmit}
                onInput={checkFormValidity}
                onChange={checkFormValidity}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {field('full_name', t('full_name'), <input type="text" name="full_name" data-required className={FIELD_CLASS} required />)}
                  {field('national_id', t('national_id'), <input type="text" name="national_id" data-required className={FIELD_CLASS} required />)}

                  <div>
                    <label className={LABEL_CLASS}>{t('phone')}</label>
                    <PhoneInput ref={phoneRef} name="phone" id="refundPhone" errorId="refundPhoneError" className={FIELD_CLASS} required />
                    <div id="refundPhoneError" className="mt-1.5 hidden text-xs text-red-600">
                      {t('phone_invalid')}
                    </div>
                    <FieldError errors={fieldErrors} field="phone" />
                  </div>

                  {field(
                    'finance_company',
                    t('finance_company'),
                    <select name="finance_company" data-required className={FIELD_CLASS} required defaultValue="">
                      <option value="">{t('choose_company')}</option>
                      {FINANCE_COMPANIES.map((company) => (
                        <option key={company.value} value={company.value}>
                          {company.label}
                        </option>
                      ))}
                    </select>,
                  )}

                  {field('finance_amount', t('finance_amount'), <input type="number" name="finance_amount" data-required className={FIELD_CLASS} required />)}

                  {field(
                    'finance_duration',
                    t('finance_duration'),
                    <>
                      <select
                        id="financeDurationSelect"
                        name={durationOther ? undefined : 'finance_duration'}
                        data-required
                        className={FIELD_CLASS}
                        required
                        defaultValue=""
                        onChange={(event) => setDurationOther(event.target.value === 'other')}
                      >
                        <option value="">{t('choose_duration')}</option>
                        {PRESET_DURATIONS.map((months) => (
                          <option key={months} value={months}>
                            {t('duration_months', { count: months })}
                          </option>
                        ))}
                        <option value="other">{t('duration_other')}</option>
                      </select>
                      <div id="financeDurationCustomWrap" className={durationOther ? 'mt-3' : 'mt-3 hidden'}>
                        <input
                          type="number"
                          id="financeDurationCustom"
                          name={durationOther ? 'finance_duration' : undefined}
                          min={1}
                          max={120}
                          placeholder={t('duration_custom_placeholder')}
                          data-required
                          className={FIELD_CLASS}
                          required={durationOther}
                        />
                      </div>
                    </>,
                  )}

                  {field('product_name', t('product_name'), <input type="text" name="product_name" data-required className={FIELD_CLASS} required />, true)}

                  {field(
                    'attachment',
                    t('attachment'),
                    <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-5 transition hover:border-brand-400 hover:bg-brand-50">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition group-hover:text-brand-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-700">{fileName ?? tp('upload_hint')}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{t('attachment_hint')}</span>
                      </span>
                      <input
                        type="file"
                        name="attachment"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        data-required
                        className="sr-only"
                        required
                        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
                      />
                    </label>,
                    true,
                  )}
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-bold text-slate-700">
                    <input type="checkbox" id="agreeTerms" className="h-4 w-4 rounded border-slate-300 bg-white text-brand-600 focus:ring-brand-600" />
                    <span>
                      {t('agree_terms')}{' '}
                      <a href="#" onClick={openTerms} className="font-semibold text-brand-600 underline hover:text-brand-700">
                        {t('terms_link_label')}
                      </a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className={`wafi-arrow-btn inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3 font-extrabold text-white transition hover:bg-brand-800 ${
                      canSubmit && !submitting ? '' : 'cursor-not-allowed opacity-40'
                    }`}
                  >
                    {t('submit_request')}
                    <ArrowIcon />
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

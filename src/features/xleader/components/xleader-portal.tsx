'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, useCallback, useRef, useState } from 'react';
import {
  DevicePhotoStep,
  FlashAlert,
  PhoneInput,
  type PhoneInputHandle,
  RequestNumberModal,
  StepWizard,
  useJumpToFirstErrorOn,
  useWizard,
  WizardDots,
  WizardProgressText,
  WizardStep,
} from '@/components/portal';
import { SubmitOverlay } from '@/components/shared/submit-overlay';
import { submitXleaderRequest } from '../api/xleader.actions';
import type { XleaderBrand } from '../api/schemas';
import { XleaderTermsCheckbox } from './terms-checkbox';
import { XleaderTermsModal } from './terms-modal';
import { WarrantyLookup } from './warranty-lookup';

/** Hard-coded in the old XleaderController@store (session 'success'); used when the backend sends no message. */
const DEFAULT_SUCCESS_MESSAGE = 'تم إرسال النموذج بنجاح!';

const FIELD_CLASS =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/15 focus:outline-none';

interface XleaderPortalProps {
  brands: XleaderBrand[];
  /** True when the brand list could not be loaded (no endpoint yet outside mock mode). */
  brandsUnavailable: boolean;
}

interface SubmitState {
  success: string | null;
  requestNumber: string | null;
  hint: string | undefined;
  messages: string[];
  fieldErrors: Record<string, string[]>;
  /** Bumped after every 422 so the wizard jumps to the first error step. */
  errorTick: number;
  flashKey: number;
}

const INITIAL: SubmitState = {
  success: null,
  requestNumber: null,
  hint: undefined,
  messages: [],
  fieldErrors: {},
  errorTick: 0,
  flashKey: 0,
};

function FieldError({ message }: { message: string | undefined }) {
  return message ? <div className="wafi-field-error mt-1.5 text-xs text-red-600">{message}</div> : null;
}

function JumpToFirstError({ trigger }: { trigger: number }) {
  useJumpToFirstErrorOn(trigger);
  return null;
}

function NextButton() {
  const tp = useTranslations('Portal');
  const { next } = useWizard();
  return (
    <button
      type="button"
      onClick={next}
      className="next wafi-arrow-btn mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-extrabold text-white transition hover:bg-brand-700"
    >
      {tp('next')}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 rtl:rotate-180">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

function XleaderForm({
  brands,
  brandsUnavailable,
  fieldErrors,
  onOpenTerms,
  onResult,
}: {
  brands: XleaderBrand[];
  brandsUnavailable: boolean;
  fieldErrors: Record<string, string[]>;
  onOpenTerms: () => void;
  onResult: (update: (state: SubmitState) => SubmitState) => void;
}) {
  const t = useTranslations('Xleader');
  const tp = useTranslations('Portal');
  const { goTo } = useWizard();
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  // Bumped after success to remount the photo step (clears chosen file names), like the old redirect back.
  const [photoKey, setPhotoKey] = useState(0);
  const err = (field: string) => fieldErrors[field]?.[0];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;

    // Same as the old intl-phone-init partial: block submission until the number is valid (E.164).
    const phone = await phoneRef.current?.validate();
    if (!phone) {
      goTo(0); // the phone error sits on step 1; show it instead of focusing a hidden input
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitXleaderRequest(new FormData(form));
      if (result.status === 'success') {
        const { request_number, message, warranty_start, warranty_end } = result.data.data;
        form.reset();
        setPhotoKey((key) => key + 1);
        goTo(0);
        onResult((state) => ({
          ...INITIAL,
          success: message ?? DEFAULT_SUCCESS_MESSAGE,
          requestNumber: request_number,
          hint: warranty_start && warranty_end ? t('warranty_activated_message', { start: warranty_start, end: warranty_end }) : undefined,
          flashKey: state.flashKey + 1,
          errorTick: state.errorTick,
        }));
      } else if (result.status === 'invalid') {
        const all = Object.values(result.errors).flat();
        onResult((state) => ({
          ...state,
          success: null,
          messages: all.length > 0 ? all : [result.message || t('submit_failed')],
          fieldErrors: result.errors,
          errorTick: state.errorTick + 1,
          flashKey: state.flashKey + 1,
        }));
      } else {
        const message = result.kind === 'not_configured' ? t('submission_unavailable') : (result.message ?? t('submit_failed'));
        onResult((state) => ({ ...state, success: null, messages: [message], fieldErrors: {}, flashKey: state.flashKey + 1 }));
      }
    } catch {
      onResult((state) => ({ ...state, success: null, messages: [t('submit_failed')], fieldErrors: {}, flashKey: state.flashKey + 1 }));
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form id="xleaderForm" encType="multipart/form-data" className="[&>.step]:mt-6" onSubmit={onSubmit}>
      <SubmitOverlay open={submitting} />
      {/* Step 1: customer details + brand */}
      <WizardStep index={0} id="step0">
        <label className="mb-2 block text-sm font-bold text-slate-700">{t('customer_name')}</label>
        <input type="text" name="customer_name" placeholder={t('customer_name_placeholder')} className={FIELD_CLASS} required />
        <FieldError message={err('customer_name')} />

        <label className="mt-4 mb-2 block text-sm font-bold text-slate-700">{t('customer_phone')}</label>
        <PhoneInput ref={phoneRef} name="customer_phone" id="xleaderPhone" errorId="xleaderPhoneError" className={FIELD_CLASS} required />
        <div id="xleaderPhoneError" className="wafi-field-error mt-1.5 hidden text-xs text-red-600">
          {t('phone_invalid')}
        </div>
        <FieldError message={err('customer_phone')} />

        <label className="mt-4 mb-2 block text-sm font-bold text-slate-700">{t('choose_brand')}</label>
        <select id="brand" name="brand" className={FIELD_CLASS} required defaultValue="">
          <option value="">{tp('choose')}</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        {brandsUnavailable && <div className="mt-1.5 text-xs text-amber-700">{t('brands_unavailable')}</div>}
        <FieldError message={err('brand')} />

        <label className="mt-4 mb-2 block text-sm font-bold text-slate-700">{t('model')}</label>
        <input type="text" name="model" placeholder={t('model_placeholder')} className={FIELD_CLASS} required />
        <FieldError message={err('model')} />

        <label className="mt-4 mb-2 block text-sm font-bold text-slate-700">{t('imei')}</label>
        <input type="text" name="imei" inputMode="numeric" maxLength={15} placeholder={t('imei_placeholder')} className={FIELD_CLASS} required />
        <p className="mt-1.5 text-xs text-slate-500">{t('imei_hint')}</p>
        <FieldError message={err('imei')} />

        <NextButton />
      </WizardStep>

      <DevicePhotoStep
        key={photoKey}
        index={1}
        batteryLabel={t('purchase_invoice')}
        errors={fieldErrors}
        submitting={submitting}
        extraBeforeSubmit={<XleaderTermsCheckbox onOpenTerms={onOpenTerms} error={err('terms_accepted')} />}
      />
    </form>
  );
}

/** The whole Xleader page body (old resources/views/xleader.blade.php, inside layouts/public). */
export function XleaderPortal({ brands, brandsUnavailable }: XleaderPortalProps) {
  const t = useTranslations('Xleader');
  const [state, setState] = useState<SubmitState>(INITIAL);
  const [termsOpen, setTermsOpen] = useState(false);
  const closeTerms = useCallback(() => setTermsOpen(false), []);
  const openTerms = useCallback(() => setTermsOpen(true), []);
  const closeRequestNumber = useCallback(() => setState((s) => ({ ...s, requestNumber: null })), []);

  return (
    <>
      <RequestNumberModal requestNumber={state.requestNumber} onClose={closeRequestNumber} hintMessage={state.hint} />
      <XleaderTermsModal open={termsOpen} onClose={closeTerms} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <FlashAlert key={state.flashKey} success={state.success} errors={state.messages} />

        <StepWizard total={2}>
          <JumpToFirstError trigger={state.errorTick} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
            <section className="lg:col-span-2" data-reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8 lg:sticky lg:top-24">
                <div className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-brand-200/30 blur-[80px]" />
                <div className="absolute -start-10 -bottom-20 h-56 w-56 rounded-full bg-brand-100/40 blur-[80px]" />

                <div className="relative">
                  <span className="text-6xl leading-none font-black text-slate-100">03</span>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t('title')}</h1>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('intro')}</p>

                  <WizardDots className="mt-8 flex items-center gap-2" />
                  <p className="mt-3 text-xs font-semibold text-slate-400">
                    <WizardProgressText />
                  </p>

                  <WarrantyLookup />
                </div>
              </div>
            </section>

            <section className="lg:col-span-3" data-reveal>
              <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-7 sm:p-8">
                  <h2 className="text-xl font-extrabold text-slate-900">{t('form_title')}</h2>
                  <p className="mt-1.5 text-sm text-slate-500">{t('form_subtitle')}</p>
                </div>

                <div className="p-7 sm:p-8">
                  <XleaderForm
                    brands={brands}
                    brandsUnavailable={brandsUnavailable}
                    fieldErrors={state.fieldErrors}
                    onOpenTerms={openTerms}
                    onResult={setState}
                  />
                </div>
              </div>
            </section>
          </div>
        </StepWizard>
      </main>
    </>
  );
}

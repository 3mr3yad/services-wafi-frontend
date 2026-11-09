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
import { MockDataBadge } from '@/components/shared/mock-data-badge';
import { submitResale } from '../api/actions';
import type { ResaleFormData } from '../api/schemas';
import { FOLDER_ICON, ResaleLookupBox } from './resale-lookup';

const FIELD = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-4 focus:ring-accent-500/15 focus:border-accent-400 focus:bg-white';
const LABEL = 'block text-sm font-bold text-slate-700 mb-2';

const ARROW_PATH = <path d="M19 12H5M12 5l-7 7 7 7" />;

function FieldError({ messages }: { messages?: string[] }) {
  const message = messages?.[0];
  return message ? <div className="wafi-field-error mt-1.5 text-xs text-red-600">{message}</div> : null;
}

function NextButton({ className }: { className: string }) {
  const tp = useTranslations('Portal');
  const { next } = useWizard();
  return (
    <button type="button" onClick={next} className={className}>
      {tp('next')}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 rtl:rotate-180">
        {ARROW_PATH}
      </svg>
    </button>
  );
}

function PrevButton() {
  const tp = useTranslations('Portal');
  const { prev } = useWizard();
  return (
    <button
      type="button"
      onClick={prev}
      className="prev wafi-arrow-btn inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 ltr:rotate-180">
        {ARROW_PATH}
      </svg>
      {tp('previous')}
    </button>
  );
}

interface FormState {
  fieldErrors: Record<string, string[]>;
  /** Bumped on every 422 so the wizard jumps to the first field error. */
  errorVersion: number;
  submitting: boolean;
}

interface ResaleFormProps {
  data: ResaleFormData;
  state: FormState;
  onSubmit: (event: FormEvent<HTMLFormElement>, phone: PhoneInputHandle | null, goToFirst: () => void) => void;
}

function ResaleForm({ data, state, onSubmit }: ResaleFormProps) {
  const t = useTranslations('Resale');
  const tp = useTranslations('Portal');
  const { goTo } = useWizard();
  const phoneRef = useRef<PhoneInputHandle>(null);
  useJumpToFirstErrorOn(state.errorVersion);
  const errors = state.fieldErrors;

  return (
    <form
      id="resaleForm"
      method="POST"
      encType="multipart/form-data"
      className="pt-6"
      onSubmit={(event) => onSubmit(event, phoneRef.current, () => goTo(0))}
    >
      {/* Step 1: customer details + brand */}
      <WizardStep index={0} id="step0">
        <label className={LABEL}>{t('customer_name')}</label>
        <input type="text" name="customer_name" placeholder={t('customer_name_placeholder')} className={FIELD} required />
        <FieldError messages={errors.customer_name} />

        <label className={`${LABEL} mt-4`}>{t('customer_phone')}</label>
        <PhoneInput ref={phoneRef} name="customer_phone" id="resalePhone" errorId="resalePhoneError" className={FIELD} required />
        {/* No wafi-field-error class here: this client-side box always exists, and would make the wizard jump to step 1 on every 422. */}
        <div id="resalePhoneError" className="mt-1.5 hidden text-xs text-red-600">
          {t('phone_invalid')}
        </div>
        <FieldError messages={errors.customer_phone} />

        <label className={`${LABEL} mt-4`}>{t('choose_brand')}</label>
        <select id="brand" name="brand" className={FIELD} required defaultValue="">
          <option value="">{tp('choose')}</option>
          {data.brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        <FieldError messages={errors.brand} />

        <label className={`${LABEL} mt-4`}>{t('model')}</label>
        <input type="text" name="model" placeholder={t('model_placeholder')} className={FIELD} required />
        <FieldError messages={errors.model} />

        <NextButton className="next wafi-arrow-btn mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-accent-600" />
      </WizardStep>

      {/* Step 2+: one per question */}
      {data.questions.map((question, index) => (
        <WizardStep key={question.id} index={index + 1} id={`step${index + 1}`}>
          <p className="mb-3 text-lg font-extrabold text-accent-600">{question.question}</p>
          {/* API contract: questions with predefined answers render as a dropdown and send the answer's TEXT;
              questions without answers keep the old free-text input. */}
          {question.answers.length > 0 ? (
            <select name={`answers[${question.id}]`} className={FIELD} required defaultValue="">
              <option value="" disabled>
                {tp('choose')}
              </option>
              {question.answers.map((answer) => (
                <option key={answer.id} value={answer.answer}>
                  {answer.answer}
                </option>
              ))}
            </select>
          ) : (
            <input type="text" name={`answers[${question.id}]`} placeholder={t('answer_placeholder')} className={FIELD} required />
          )}
          <FieldError messages={errors[`answers.${question.id}`]} />

          <div className="mt-7 flex justify-between">
            <PrevButton />
            <NextButton className="next wafi-arrow-btn inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-7 py-3 font-extrabold text-white transition hover:bg-accent-600" />
          </div>
        </WizardStep>
      ))}

      <DevicePhotoStep index={data.questions.length + 1} accent="accent" errors={errors} submitting={state.submitting} />
    </form>
  );
}

interface ResaleViewProps {
  /** null when the render-time data (brands + questions) could not be loaded. */
  data: ResaleFormData | null;
  isMock: boolean;
}

/** The trade-in page body (old resources/views/resale.blade.php). */
export function ResaleView({ data, isMock }: ResaleViewProps) {
  const t = useTranslations('Resale');
  const [success, setSuccess] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);
  const [flashErrors, setFlashErrors] = useState<string[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [state, setState] = useState<FormState>({ fieldErrors: {}, errorVersion: 0, submitting: false });

  const submitLock = useRef(false);
  const closeModal = useCallback(() => setRequestNumber(null), []);
  const total = (data?.questions.length ?? 0) + 2;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>, phone: PhoneInputHandle | null, goToFirst: () => void) => {
    event.preventDefault();
    // Ref, not state: a fast double click arrives before the submitting state re-renders.
    if (submitLock.current) return;
    submitLock.current = true;
    const form = event.currentTarget;

    const e164 = await phone?.validate();
    if (!e164) {
      submitLock.current = false;
      goToFirst();
      return;
    }

    const formData = new FormData(form);
    setState((s) => ({ ...s, submitting: true }));
    let result: Awaited<ReturnType<typeof submitResale>>;
    try {
      result = await submitResale(formData);
    } catch {
      // e.g. the Server Action body limit rejected the photos.
      result = { status: 'error', kind: 'network' };
    }
    submitLock.current = false;

    if (result.status === 'success') {
      // Old: redirect()->back()->with('success', ...)->with('request_number', ...): fresh form + modal.
      setSuccess(result.data.message ?? t('submission_success'));
      setRequestNumber(result.data.request_number);
      setFlashErrors([]);
      setState({ fieldErrors: {}, errorVersion: 0, submitting: false });
      setFormKey((k) => k + 1);
      return;
    }

    setSuccess(null);
    if (result.status === 'invalid') {
      const all = Object.values(result.errors).flat();
      setFlashErrors(all.length > 0 ? all : [result.message]);
      setState((s) => ({ fieldErrors: result.errors, errorVersion: s.errorVersion + 1, submitting: false }));
    } else {
      setFlashErrors([result.kind === 'not_configured' ? t('submission_unavailable') : (result.message ?? t('submission_error'))]);
      setState((s) => ({ ...s, fieldErrors: {}, submitting: false }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SubmitOverlay open={state.submitting} />
      <RequestNumberModal requestNumber={requestNumber} onClose={closeModal} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <FlashAlert success={success} errors={flashErrors} />

        <StepWizard key={formKey} total={total}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
            <section className="lg:col-span-2" data-reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8 lg:sticky lg:top-24">
                <div className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-accent-200/30 blur-[80px]" />
                <div className="absolute -start-10 -bottom-20 h-56 w-56 rounded-full bg-accent-100/40 blur-[80px]" />

                <div className="relative">
                  <span className="text-6xl leading-none font-black text-slate-100">02</span>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      {FOLDER_ICON}
                    </svg>
                  </div>
                  <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t('title')}</h1>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('intro')}</p>

                  <WizardDots className="mt-8 flex items-center gap-2" />
                  <p className="mt-3 text-xs font-semibold text-slate-400">
                    <WizardProgressText />
                  </p>

                  <ResaleLookupBox />
                </div>
              </div>
            </section>

            <section className="lg:col-span-3" data-reveal>
              <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-7 sm:p-8">
                  <h2 className="text-xl font-extrabold text-slate-900">{t('form_title')}</h2>
                  <p className="mt-1.5 text-sm text-slate-500">{t('form_subtitle')}</p>
                  {isMock && (
                    <div className="mt-3">
                      <MockDataBadge label={t('mock_badge')} />
                    </div>
                  )}
                </div>

                <div className="p-7 sm:p-8">
                  {data ? (
                    <ResaleForm data={data} state={state} onSubmit={(event, phone, goToFirst) => void handleSubmit(event, phone, goToFirst)} />
                  ) : (
                    <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
                      {t('data_unavailable')}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </StepWizard>
      </main>
    </>
  );
}

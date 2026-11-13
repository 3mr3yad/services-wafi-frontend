'use client';

import { useLocale, useTranslations } from 'next-intl';
import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { PhoneInput, type PhoneInputHandle, StepWizard, useWizard, WizardStep } from '@/components/portal';
import { SubmitOverlay } from '@/components/shared/submit-overlay';
import { AfterReveal, RevealNumber, SuccessMark } from '@/components/shared/success-celebration';
import { submitInstallmentRequest } from '../api/actions';
import { type InstallmentKind, OPEN_EVENT, type OpenDetail } from './events';
import { BRAND } from '../brand';
import { BrandLogo, ForwardArrow, Icon } from './art';

type InstallmentType = '' | InstallmentKind;
type FieldErrors = Record<string, string[]>;

const STEP_FIELDS: string[][] = [
  ['installment_type', 'car_type', 'car_model', 'car_value'],
  ['full_name', 'email', 'phone', 'national_id'],
  ['salary', 'obligations', 'employer_type', 'employment_duration'],
];

/** Prefix for field ids, so the dialog form and the inline page form can coexist. */
const IdPrefix = createContext('ov');

function FieldError({ errors, name }: { errors: FieldErrors; name: string }) {
  const message = errors[name]?.[0];
  return message ? <p className="wafi-field-error mt-1.5 text-xs font-medium text-rose-300">{message}</p> : null;
}

function Field({ name, label, errors, children, className }: { name: string; label: string; errors: FieldErrors; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="ov-label" htmlFor={`${useContext(IdPrefix)}-${name}`}>
        {label}
      </label>
      {children}
      <FieldError errors={errors} name={name} />
    </div>
  );
}

function StepHeader({ labels }: { labels: string[] }) {
  const { current, total } = useWizard();
  const t = useTranslations('Installments.landing');
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between text-xs font-bold text-[#E6FAFC]/55">
        <span>{t('step_counter', { current: current + 1, total })}</span>
        <span className="text-[#7DE6EE]">{labels[current]}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {labels.map((label, i) => (
          <span key={label} className={`h-1.5 rounded-full transition-colors duration-300 ${i <= current ? 'bg-[#7DE6EE] shadow-[0_0_12px_rgb(125_230_238/0.6)]' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}

function StepNav({ submitting, last }: { submitting: boolean; last?: boolean }) {
  const { current, next, prev } = useWizard();
  const t = useTranslations('Installments');
  const tl = useTranslations('Installments.landing');
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {current > 0 ? (
        <button type="button" onClick={prev} className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-bold text-[#E6FAFC]/70 hover:bg-white/5 hover:text-white">
          <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" strokeWidth={2.2} />
          {tl('previous')}
        </button>
      ) : (
        <span />
      )}
      {last ? (
        <button type="submit" disabled={submitting} className="ov-btn ov-btn-primary">
          {submitting ? tl('submitting') : t('submit_request')}
          {!submitting && <ForwardArrow />}
        </button>
      ) : (
        <button type="button" onClick={next} className="ov-btn ov-btn-primary">
          {tl('next')}
          <ForwardArrow />
        </button>
      )}
    </div>
  );
}

/** Jumps to the step of the first server-side field error. */
function ErrorJumper({ errors }: { errors: FieldErrors }) {
  const { goTo } = useWizard();
  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length === 0) return;
    const step = STEP_FIELDS.findIndex((fields) => fields.some((field) => keys.includes(field)));
    if (step >= 0) goTo(step);
  }, [errors, goTo]);
  return null;
}

/** When the dialog is opened from the phone / car cards, preselect that type and show step 1. */
function ChooseListener({ onChoose }: { onChoose: (type: InstallmentType) => void }) {
  const { goTo } = useWizard();
  useEffect(() => {
    const handler = (event: Event) => {
      const { tab, type } = (event as CustomEvent<OpenDetail>).detail;
      if (tab !== 'apply' || !type) return;
      onChoose(type);
      goTo(0);
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, [goTo, onChoose]);
  return null;
}

/** Back to step 2 when the phone number fails validation on submit. */
function PhoneStepJumper({ trigger }: { trigger: number }) {
  const { goTo } = useWizard();
  useEffect(() => {
    if (trigger > 0) goTo(1);
  }, [trigger, goTo]);
  return null;
}

/**
 * The 3-step installments form. `idPrefix` keeps ids unique when the form appears twice on the page;
 * `listenToOpen` lets only the dialog copy react to the page's "open" buttons.
 */
export function ApplyForm({ idPrefix = 'ov', listenToOpen = true }: { idPrefix?: string; listenToOpen?: boolean } = {}) {
  const t = useTranslations('Installments');
  const tl = useTranslations('Installments.landing');
  const locale = useLocale();
  const phoneLocale = locale === 'ar' ? 'ar' : 'en';

  const [type, setType] = useState<InstallmentType>('');
  const [salary, setSalary] = useState('');
  const [obligations, setObligations] = useState('0');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ number: string; message: string } | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [phoneInvalidAt, setPhoneInvalidAt] = useState(0);
  const phoneRef = useRef<PhoneInputHandle>(null);

  const stepLabels = [tl('form_step_1'), tl('form_step_2'), tl('form_step_3')];
  const net = Number(salary || 0) - Number(obligations || 0);
  const showNet = salary !== '' && Number.isFinite(net);
  const money = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', { maximumFractionDigits: 0 });
  // Share of the salary left after obligations (null when there is no salary to divide by).
  const salaryValue = Number(salary || 0);
  const netShare = showNet && salaryValue > 0 ? net / salaryValue : null;
  const percent = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', { style: 'percent', maximumFractionDigits: 0 });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const phone = await phoneRef.current?.validate();
    if (!phone) {
      setPhoneInvalidAt(Date.now());
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const result = await submitInstallmentRequest(new FormData(form));
      if (result.status === 'success') {
        setErrors({});
        setSuccess({ number: result.data.data.request_number, message: result.data.data.message ?? t('api_submitted_message') });
      } else if (result.status === 'invalid') {
        setErrors(result.errors);
        setFormError(result.message && Object.keys(result.errors).length === 0 ? result.message : null);
      } else {
        setErrors({});
        setFormError(result.kind === 'rate_limited' ? tl('error_rate_limited') : (result.message ?? tl('error_generic')));
      }
    } catch {
      setFormError(tl('error_generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = () => {
    setSuccess(null);
    setType('');
    setSalary('');
    setObligations('0');
    setErrors({});
    setFormError(null);
    setFormKey((key) => key + 1);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center py-6 text-center" role="status">
        <SuccessMark accent="#7DE6EE" ink="#11131A" />
        <AfterReveal delay={0.85}>
          <h3 className="mt-5 text-2xl font-extrabold text-white">{tl('success_title')}</h3>
          <p className="mt-2 max-w-sm text-sm text-[#E6FAFC]/55">{success.message}</p>
        </AfterReveal>
        <div className="mt-6 w-full max-w-xs rounded-2xl border border-dashed border-[#7DE6EE]/60 bg-[#7DE6EE]/[0.06] px-5 py-4 shadow-[0_0_40px_-12px_rgb(125_230_238/0.5)]">
          <div className="text-xs font-bold text-[#E6FAFC]/55">{tl('success_number')}</div>
          <RevealNumber value={success.number} className="mt-1 block text-4xl font-semibold tracking-tight text-[#7DE6EE] select-all" />
        </div>
        <AfterReveal delay={1 + success.number.length * 0.07} className="flex flex-col items-center">
          <p className="mt-3 text-xs text-[#E6FAFC]/55">{tl('success_hint')}</p>
          {BRAND.showApprovalDisclaimer && (
            <p className="mt-4 max-w-sm rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-[#E6FAFC]/65">{tl('disclaimer_short')}</p>
          )}
          <button type="button" onClick={startOver} className="mt-7 text-sm font-bold text-white underline decoration-[#7DE6EE] decoration-2 underline-offset-4">
            {tl('success_again')}
          </button>
        </AfterReveal>
      </div>
    );
  }

  return (
    <IdPrefix.Provider value={idPrefix}>
    <SubmitOverlay open={submitting} accent="#7DE6EE" container="[data-service=installments]" logo={<BrandLogo className="text-6xl" />} />
    <StepWizard key={formKey} total={3}>
      <form onSubmit={onSubmit}>
        {listenToOpen && <ChooseListener onChoose={setType} />}
        <ErrorJumper errors={errors} />
        <PhoneStepJumper trigger={phoneInvalidAt} />
        <StepHeader labels={stepLabels} />

        {formError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">
            <Icon name="x" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.4} />
            <div>
              <div className="font-bold text-rose-100">{tl('error_title')}</div>
              {formError}
            </div>
          </div>
        )}

        {/* Step 1: installment type (+ car details) */}
        <WizardStep index={0}>
          <fieldset>
            <legend className="ov-label">{t('installment_type')}</legend>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(
                [
                  ['phone', 'phone', t('type_phone')],
                  ['device', 'device', t('type_device')],
                  ['car', 'car', t('type_car')],
                ] as const
              ).map(([value, icon, label]) => (
                <label key={value} className="ov-choice cursor-pointer">
                  <input
                    type="radio"
                    name="installment_type"
                    value={value}
                    required
                    className="sr-only"
                    checked={type === value}
                    onChange={() => setType(value)}
                  />
                  <span className="ov-choice-body flex flex-col items-center gap-3 rounded-2xl border-[1.5px] border-[#7DE6EE]/15 bg-white/[0.03] px-2 py-5 hover:border-[#7DE6EE]/40 text-center transition sm:px-3 sm:py-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7DE6EE]/10 text-[#7DE6EE]">
                      <Icon name={icon} className="h-6 w-6" />
                    </span>
                    <span className="text-xs leading-snug font-extrabold text-white sm:text-sm">{label}</span>
                  </span>
                </label>
              ))}
            </div>
            <FieldError errors={errors} name="installment_type" />
          </fieldset>

          {type === 'car' && (
            <div className="mt-6 rounded-2xl border border-[#7DE6EE]/15 bg-white/[0.03] p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-white">
                <Icon name="car" className="h-5 w-5 text-[#7DE6EE]" />
                {tl('car_details')}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field name="car_type" label={t('car_type')} errors={errors}>
                  <input id={`${idPrefix}-car_type`} name="car_type" type="text" required maxLength={255} className="ov-field" />
                </Field>
                <Field name="car_model" label={t('car_model')} errors={errors}>
                  <input id={`${idPrefix}-car_model`} name="car_model" type="text" required maxLength={255} className="ov-field" />
                </Field>
                <Field name="car_value" label={t('car_value')} errors={errors}>
                  <input id={`${idPrefix}-car_value`} name="car_value" type="number" inputMode="decimal" min="0" step="0.01" required className="ov-field" dir="ltr" />
                </Field>
              </div>
            </div>
          )}
          <StepNav submitting={submitting} />
        </WizardStep>

        {/* Step 2: personal details */}
        <WizardStep index={1}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field name="full_name" label={t('full_name')} errors={errors}>
              <input id={`${idPrefix}-full_name`} name="full_name" type="text" required maxLength={255} autoComplete="name" className="ov-field" />
            </Field>
            <Field name="email" label={t('email')} errors={errors}>
              <input id={`${idPrefix}-email`} name="email" type="email" required maxLength={255} autoComplete="email" className="ov-field" dir="ltr" />
            </Field>
            <Field name="phone" label={t('phone')} errors={errors}>
              <PhoneInput ref={phoneRef} id={`${idPrefix}-phone`} name="phone" errorId={`${idPrefix}-phone-error`} required dropdownInBody locale={phoneLocale} className="ov-field" />
              <p id={`${idPrefix}-phone-error`} className="mt-1.5 hidden text-xs font-medium text-rose-300">
                {t('phone_invalid')}
              </p>
            </Field>
            <Field name="national_id" label={t('national_id')} errors={errors}>
              <input id={`${idPrefix}-national_id`} name="national_id" type="text" required maxLength={255} inputMode="numeric" className="ov-field" dir="ltr" />
            </Field>
          </div>
          <StepNav submitting={submitting} />
        </WizardStep>

        {/* Step 3: income & work */}
        <WizardStep index={2}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field name="salary" label={t('salary')} errors={errors}>
              <input
                id={`${idPrefix}-salary`}
                name="salary"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                className="ov-field"
                dir="ltr"
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
              />
            </Field>
            <Field name="obligations" label={t('obligations')} errors={errors}>
              <input
                id={`${idPrefix}-obligations`}
                name="obligations"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                className="ov-field"
                dir="ltr"
                value={obligations}
                onChange={(event) => setObligations(event.target.value)}
              />
            </Field>
            <Field name="employer_type" label={t('employer_type')} errors={errors}>
              <select id={`${idPrefix}-employer_type`} name="employer_type" required defaultValue="" className="ov-field">
                <option value="">{t('choose_employer_type')}</option>
                <option value="government">{t('employer_type_government')}</option>
                <option value="employee">{t('employer_type_employee')}</option>
                <option value="retired">{t('employer_type_retired')}</option>
              </select>
            </Field>
            <Field name="employment_duration" label={t('employment_duration')} errors={errors}>
              <select id={`${idPrefix}-employment_duration`} name="employment_duration" required defaultValue="" className="ov-field">
                <option value="">{t('choose_employment_duration')}</option>
                <option value="under_3_months">{t('employment_duration_under_3_months')}</option>
                <option value="over_3_months">{t('employment_duration_over_3_months')}</option>
              </select>
            </Field>
          </div>

          {showNet && (
            <div className="mt-6 rounded-2xl border border-[#7DE6EE]/20 bg-[#7DE6EE]/[0.06] px-5 py-4 text-[#E6FAFC]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#E6FAFC]/70">{tl('net_income_label')}</div>
                  <div className="mt-0.5 text-[11px] text-[#E6FAFC]/45">{tl('net_income_note')}</div>
                </div>
                <div className="text-end">
                  <div className={`text-2xl font-semibold whitespace-nowrap ${net < 0 ? 'text-rose-300' : 'text-[#7DE6EE]'}`}>
                    {money.format(net)} <span className="text-xs text-[#E6FAFC]/60">{tl('currency')}</span>
                  </div>
                  {netShare !== null && (
                    <div className={`mt-0.5 text-xs font-bold whitespace-nowrap ${net < 0 ? 'text-rose-300' : 'text-[#E6FAFC]/70'}`}>
                      {tl('net_income_share', { percent: percent.format(netShare) })}
                    </div>
                  )}
                </div>
              </div>
              {netShare !== null && (
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(Math.max(0, netShare) * 100)}
                  aria-label={tl('net_income_label')}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${net < 0 ? 'bg-rose-400' : 'bg-[#7DE6EE] shadow-[0_0_10px_rgb(125_230_238/0.6)]'}`}
                    style={{ width: `${net < 0 ? 100 : Math.min(100, netShare * 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}
          {BRAND.showApprovalDisclaimer && (
            <p className="mt-6 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-[#E6FAFC]/60">
              <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-[#7DE6EE]" />
              {tl('disclaimer_full')}
            </p>
          )}
          <StepNav submitting={submitting} last />
        </WizardStep>
      </form>
    </StepWizard>
    </IdPrefix.Provider>
  );
}

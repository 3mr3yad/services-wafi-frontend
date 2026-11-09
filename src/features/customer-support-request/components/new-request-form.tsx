'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, useRef, useState, useTransition } from 'react';
import { SubmitOverlay } from '@/components/shared/submit-overlay';
import { PhoneInput, type PhoneInputHandle } from '@/components/portal';
import { submitSupportRequest } from '../api/actions';
import { GENERAL_INQUIRY, ISSUE_TYPES, SHIPPING } from '../constants';

const FIELD_CLASS =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-4 focus:ring-accent-500/15 focus:border-accent-400 focus:bg-white';

export interface SubmitFeedback {
  success?: { message: string; requestNumber: string };
  errors?: string[];
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <div className="mt-1.5 text-xs text-red-600 wafi-field-error">{message}</div>;
}

/** Panel A of the old page: the new-ticket form (customer-support-request.store). */
export function NewRequestForm({ onFeedback, hidden }: { onFeedback: (feedback: SubmitFeedback) => void; hidden: boolean }) {
  const t = useTranslations('CustomerSupport');
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [issueType, setIssueType] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, startTransition] = useTransition();

  const isGeneralInquiry = issueType === GENERAL_INQUIRY;
  const first = (key: string) => fieldErrors[key]?.[0];
  const firstAttachmentItemError = Object.entries(fieldErrors).find(([key]) => key.startsWith('attachments.'))?.[1][0];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;

    const phone = await phoneRef.current?.validate();
    if (!phone) return;

    const formData = new FormData(form);
    formData.set('customer_phone', phone);
    // An empty file input still sends one empty entry; drop it like the browser-side upload would.
    const files = formData.getAll('attachments[]').filter((file) => file instanceof File && file.size > 0);
    formData.delete('attachments[]');
    for (const file of files) formData.append('attachments[]', file);

    startTransition(async () => {
      const result = await submitSupportRequest(formData);
      if (result.status === 'success') {
        form.reset();
        setIssueType('');
        setFileNames([]);
        setFieldErrors({});
        onFeedback({
          success: { message: result.data.data.message ?? t('confirmation_message'), requestNumber: result.data.data.request_number },
        });
      } else if (result.status === 'invalid') {
        setFieldErrors(result.errors);
        const all = Object.values(result.errors).flat();
        onFeedback({ errors: all.length > 0 ? all : [result.message || t('submission_failed')] });
      } else {
        setFieldErrors({});
        onFeedback({
          errors: [result.kind === 'not_configured' ? t('submission_unavailable') : (result.message ?? t('submission_failed'))],
        });
      }
    });
  };

  return (
    <section id="newRequestPanel" className={hidden ? 'mt-6 hidden wafi-animate-in' : 'mt-6 wafi-animate-in'}>
      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-7 sm:p-8 border-b border-dashed border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-900">{t('form_title')}</h2>
          <p className="text-sm text-slate-500 mt-1.5">{t('form_subtitle')}</p>
        </div>

        <div className="p-7 sm:p-8">
          <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-5" aria-busy={pending}>
            <SubmitOverlay open={pending} />
            {/* mt-5: the old form's leading @csrf input pushed the first field down (Tailwind v3 space-y). */}
            <div className="mt-5">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('customer_name')}</label>
              <input type="text" name="customer_name" className={FIELD_CLASS} required />
              <FieldError message={first('customer_name')} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('customer_phone')}</label>
              <PhoneInput ref={phoneRef} name="customer_phone" id="customerPhone" className={FIELD_CLASS} required errorId="customerPhoneClientError" />
              <div id="customerPhoneClientError" className="hidden mt-1.5 text-xs text-red-600 wafi-field-error">
                {t('phone_invalid')}
              </div>
              <FieldError message={first('customer_phone')} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('issue_type')}</label>
              <select
                id="issueType"
                name="issue_type"
                value={issueType}
                onChange={(event) => setIssueType(event.target.value)}
                className={FIELD_CLASS}
                required
              >
                <option value="">{t('issue_type_placeholder')}</option>
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`issue_types.${type}`)}
                  </option>
                ))}
              </select>
              <FieldError message={first('issue_type')} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t('order_number')}{' '}
                <span id="orderNumberOptionalHint" className={isGeneralInquiry ? 'font-normal text-slate-400' : 'hidden font-normal text-slate-400'}>
                  {t('order_number_optional_hint')}
                </span>
              </label>
              <input type="text" id="orderNumber" name="order_number" className={FIELD_CLASS} required={!isGeneralInquiry} />
              <FieldError message={first('order_number')} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('issue_description')}</label>
              <textarea
                id="issueDescription"
                name="issue_description"
                rows={4}
                placeholder={issueType === SHIPPING ? t('issue_description_placeholder_shipping') : t('issue_description_placeholder_default')}
                className={FIELD_CLASS}
                required
              />
              <FieldError message={first('issue_description')} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('attachments')}</label>
              <p className="text-xs text-slate-400 mb-2.5">{t('attachments_hint')}</p>
              <label
                htmlFor="attachmentsInput"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center cursor-pointer transition hover:border-accent-400/50 hover:bg-accent-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-accent-600">
                  <path d="M12 16V4M7 9l5-5 5 5" />
                  <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                </svg>
                <span className="text-sm font-bold text-slate-700">{t('attachments_choose')}</span>
                <input
                  type="file"
                  id="attachmentsInput"
                  name="attachments[]"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(event) => setFileNames(Array.from(event.target.files ?? []).map((file) => file.name))}
                />
              </label>
              <div id="attachmentsList" className="mt-2.5 flex flex-wrap gap-2">
                {fileNames.map((name, index) => (
                  <span key={`${index}-${name}`} className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs text-slate-600">
                    {name}
                  </span>
                ))}
              </div>
              <FieldError message={first('attachments')} />
              <FieldError message={firstAttachmentItemError} />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="wafi-arrow-btn w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 font-extrabold text-ink-950 hover:bg-accent-400 transition disabled:opacity-70"
            >
              {t('submit')}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 rtl:rotate-180">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

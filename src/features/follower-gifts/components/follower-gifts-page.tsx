'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, useCallback, useRef, useState, useTransition } from 'react';
import { FlashAlert, PhoneInput, type PhoneInputHandle, RequestNumberModal } from '@/components/portal';
import { submitFollowerGift } from '../api/actions';

const FIELD_CLASS =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-4 focus:ring-accent-500/15 focus:border-accent-400 focus:bg-white';

// Tailwind v4 preflight zeroes the date editor padding; v3 (old site) kept Chrome's 1px, so the field was 2px taller.
const DATE_FIELD_CLASS = `${FIELD_CLASS} [&::-webkit-datetime-edit]:py-px`;

const TEXT_FIELDS = [
  { name: 'full_name', type: 'text', wide: false },
  // phone is rendered separately (PhoneInput), right after full_name
  { name: 'city', type: 'text', wide: false },
  { name: 'district', type: 'text', wide: false },
  { name: 'national_address', type: 'text', wide: true },
  { name: 'winning_platform', type: 'text', wide: false },
  { name: 'draw_presenter', type: 'text', wide: false },
  { name: 'draw_date', type: 'date', wide: false },
  { name: 'prize_type', type: 'text', wide: false },
] as const;

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <div className="mt-1.5 text-xs text-red-600 wafi-field-error">{message}</div>;
}

/** Port of resources/views/follower-gift.blade.php (content section). */
export function FollowerGiftsPage() {
  const t = useTranslations('FollowerGifts');
  const tp = useTranslations('Portal');
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const closeModal = useCallback(() => setRequestNumber(null), []);
  const first = (key: string) => fieldErrors[key]?.[0];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;

    const phone = await phoneRef.current?.validate();
    if (!phone) return;

    const formData = new FormData(form);
    formData.set('phone', phone);

    startTransition(async () => {
      const result = await submitFollowerGift(formData);
      if (result.status === 'success') {
        form.reset();
        setFileName(null);
        setFieldErrors({});
        setErrors([]);
        setSuccess(result.data.data.message ?? t('success_message'));
        setRequestNumber(result.data.data.request_number);
      } else if (result.status === 'invalid') {
        setSuccess(null);
        setFieldErrors(result.errors);
        const all = Object.values(result.errors).flat();
        setErrors(all.length > 0 ? all : [result.message || t('submission_failed')]);
      } else {
        setSuccess(null);
        setFieldErrors({});
        setErrors([result.kind === 'not_configured' ? t('submission_unavailable') : (result.message ?? t('submission_failed'))]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const textField = (field: (typeof TEXT_FIELDS)[number]) => (
    <div key={field.name} className={field.wide ? 'md:col-span-2' : undefined}>
      <label className="block text-sm font-bold text-slate-700 mb-2">{t(field.name)}</label>
      <input type={field.type} name={field.name} className={field.type === 'date' ? DATE_FIELD_CLASS : FIELD_CLASS} required />
      <FieldError message={first(field.name)} />
    </div>
  );

  const [fullName, ...restFields] = TEXT_FIELDS;

  return (
    <>
      <RequestNumberModal requestNumber={requestNumber} onClose={closeModal} />

      <main className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <section className="lg:col-span-2" data-reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8 shadow-sm lg:sticky lg:top-24">
              <div className="absolute -top-16 -end-16 h-56 w-56 rounded-full bg-accent-200/30 blur-[80px]" />
              <div className="absolute -bottom-20 -start-10 h-56 w-56 rounded-full bg-accent-100/40 blur-[80px]" />

              <div className="relative">
                <span className="text-6xl font-black text-slate-100 leading-none">04</span>
                <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                </div>
                <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{t('title')}</h1>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{t('intro')}</p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-bold text-slate-600">{t('status_label')}</div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t('status_new')}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-bold text-slate-600">{t('note_label')}</div>
                    <div className="text-slate-500 mt-1 text-sm">{t('note_value')}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-3" data-reveal>
            <FlashAlert success={success} errors={errors} />

            <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="p-7 sm:p-8 border-b border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-900">{t('form_title')}</h2>
                <p className="text-sm text-slate-500 mt-1.5">{t('form_subtitle')}</p>
              </div>

              <form onSubmit={onSubmit} encType="multipart/form-data" className="p-7 sm:p-8" aria-busy={pending}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fullName && textField(fullName)}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('phone')}</label>
                    <PhoneInput ref={phoneRef} name="phone" id="followerGiftPhone" className={FIELD_CLASS} required errorId="followerGiftPhoneError" />
                    <div id="followerGiftPhoneError" className="hidden mt-1.5 text-xs text-red-600 wafi-field-error">
                      {t('phone_invalid')}
                    </div>
                    <FieldError message={first('phone')} />
                  </div>

                  {restFields.map(textField)}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('winning_image')}</label>
                    <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-5 transition hover:border-accent-400 hover:bg-accent-50">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-accent-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                          <path d="m21 15-5-5L5 21" />
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-700">{fileName ?? tp('upload_hint')}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{tp('file_types_hint')}</span>
                      </span>
                      <input
                        type="file"
                        name="winning_image"
                        className="sr-only"
                        required
                        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
                      />
                    </label>
                    <FieldError message={first('winning_image')} />
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between rounded-2xl bg-slate-50 border border-slate-200 p-5">
                  <div className="text-xs text-slate-500">{t('submit_note')}</div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="wafi-arrow-btn inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-3 font-extrabold text-white hover:bg-accent-600 transition disabled:opacity-70"
                  >
                    {t('submit')}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 rtl:rotate-180">
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
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

'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { FlashAlert, RequestNumberModal } from '@/components/portal';
import { NewRequestForm, type SubmitFeedback } from './new-request-form';
import { TrackRequestPanel } from './track-request-panel';

const TAB_BASE = 'rounded-full px-5 py-2.5 text-sm font-bold transition border';
const TAB_ACTIVE = `${TAB_BASE} text-white bg-[#2fb6e9] border-[#2fb6e9]`;
const TAB_IDLE = `${TAB_BASE} text-slate-500 bg-white border-slate-200`;

/** Port of resources/views/customer-support-request.blade.php (content section). */
export function CustomerSupportPage() {
  const t = useTranslations('CustomerSupport');
  const [tab, setTab] = useState<'new' | 'track'>('new');
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  const onFeedback = useCallback((feedback: SubmitFeedback) => {
    setSuccess(feedback.success?.message ?? null);
    setRequestNumber(feedback.success?.requestNumber ?? null);
    setErrors(feedback.errors ?? []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeModal = useCallback(() => setRequestNumber(null), []);

  return (
    <>
      <FlashAlert success={success} errors={errors} />
      <RequestNumberModal requestNumber={requestNumber} onClose={closeModal} hintMessage={t('confirmation_message')} />

      <main className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-sm p-7 sm:p-9 text-center" data-reveal>
          <div className="absolute -top-20 start-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-accent-200/30 blur-[90px]" />
          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{t('title')}</h1>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-md mx-auto">{t('intro')}</p>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 wafi-animate-in">
          <button type="button" id="tabNewRequest" className={tab === 'new' ? TAB_ACTIVE : TAB_IDLE} onClick={() => setTab('new')}>
            {t('tab_new_request')}
          </button>
          <button type="button" id="tabTrackRequest" className={tab === 'track' ? TAB_ACTIVE : TAB_IDLE} onClick={() => setTab('track')}>
            {t('tab_track_request')}
          </button>
        </div>

        <NewRequestForm onFeedback={onFeedback} hidden={tab !== 'new'} />
        <TrackRequestPanel hidden={tab !== 'track'} />
      </main>
    </>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { type FormEvent, useRef, useState } from 'react';
import { PhoneInput, type PhoneInputHandle } from '@/components/portal';
import { lookupInstallmentRequest } from '../api/actions';
import type { InstallmentLookupRecord } from '../api/schemas';
import { Icon } from './art';
import { CompletedBanner, FinancingCard, StageTracker } from './track-details';

const STATUS_KEYS = {
  processing: 'status_processing',
  accepted: 'status_accepted',
  rejected: 'status_rejected',
  offer_accepted: 'status_offer_accepted',
  offer_rejected: 'status_offer_rejected',
} as const;

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-amber-400/15 text-(--ov-warn) ring-amber-300/30',
  accepted: 'bg-emerald-400/15 text-(--ov-success) ring-emerald-300/30',
  rejected: 'bg-rose-400/15 text-(--ov-danger) ring-rose-300/30',
  offer_accepted: 'bg-(--ov-accent)/15 text-(--ov-accent) ring-(--ov-accent)/30',
  offer_rejected: 'bg-pink-400/15 text-(--ov-pink) ring-pink-300/30',
};

type StageState = 'done' | 'current' | 'failed' | 'todo';

/** Maps the backend status to the 3-stage timeline: received → review → offer. */
function stagesFor(status: string): [StageState, StageState, StageState] {
  switch (status) {
    case 'processing':
      return ['done', 'current', 'todo'];
    case 'accepted':
      return ['done', 'done', 'current'];
    case 'rejected':
      return ['done', 'failed', 'todo'];
    case 'offer_accepted':
      return ['done', 'done', 'done'];
    case 'offer_rejected':
      return ['done', 'done', 'failed'];
    default:
      return ['done', 'current', 'todo'];
  }
}

const DOT: Record<StageState, string> = {
  done: 'bg-[#7DE6EE] text-[#11131A]',
  current: 'bg-(--ov-surface) text-(--ov-accent) ring-2 ring-(--ov-accent) animate-pulse',
  failed: 'bg-rose-400 text-[#11131A]',
  todo: 'bg-(--ov-tint)/10 text-(--ov-fg)/40',
};

export function TrackResult({ record, onRefresh, refreshing }: { record: InstallmentLookupRecord; onRefresh: () => void; refreshing: boolean }) {
  const t = useTranslations('Installments');
  const tl = useTranslations('Installments.landing');
  const statusKey = STATUS_KEYS[record.status as keyof typeof STATUS_KEYS] as (typeof STATUS_KEYS)[keyof typeof STATUS_KEYS] | undefined;
  const TYPE_LABELS: Record<string, string> = { car: t('type_car'), phone: t('type_phone'), device: t('type_device') };
  const typeLabel = TYPE_LABELS[record.installmentType] ?? record.installmentType;
  const stages = stagesFor(record.status);
  const stageLabels = [tl('timeline_received'), tl('timeline_review'), tl('timeline_offer')];
  // Post-offer tracking only exists once the offer is accepted (or the request is already finished).
  const postOffer = record.status === 'offer_accepted' || record.completedAt !== null;

  return (
    <div className="mt-6 rounded-2xl border border-(--ov-accent)/20 bg-(--ov-surface)/60 p-5" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs text-(--ov-ink)/55">{t('lookup_full_name')}</div>
          <div className="mt-0.5 text-lg font-extrabold text-(--ov-fg)">{record.fullName}</div>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${STATUS_STYLES[record.status] ?? 'bg-(--ov-tint)/10 text-(--ov-fg) ring-(--ov-tint)/20'}`}>
          {statusKey ? t(statusKey) : record.status}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-(--ov-tint)/[0.04] px-3 py-2.5">
          <dt className="text-xs text-(--ov-ink)/55">{t('lookup_type')}</dt>
          <dd className="mt-0.5 font-bold text-(--ov-fg)">{typeLabel}</dd>
        </div>
        <div className="rounded-xl bg-(--ov-tint)/[0.04] px-3 py-2.5">
          <dt className="text-xs text-(--ov-ink)/55">{t('lookup_submitted_at')}</dt>
          <dd className="mt-0.5 font-bold text-(--ov-fg)" dir="ltr">
            {record.submittedAt}
          </dd>
        </div>
      </dl>

      <ol className="mt-5 grid grid-cols-3 gap-2">
        {stageLabels.map((label, i) => {
          const state = stages[i] ?? 'todo';
          return (
            <li key={label} className="flex flex-col items-center gap-2 text-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${DOT[state]}`}>
                {state === 'failed' ? (
                  <Icon name="x" className="h-4 w-4" strokeWidth={2.6} />
                ) : state === 'done' ? (
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                ) : (
                  <Icon name="clock" className="h-4 w-4" />
                )}
              </span>
              <span className={`text-xs font-bold ${state === 'todo' ? 'text-(--ov-fg)/40' : 'text-(--ov-ink)'}`}>{label}</span>
            </li>
          );
        })}
      </ol>

      {record.adminNote ? (
        <div className="mt-5 border-t border-(--ov-tint)/10 pt-4">
          <div className="text-xs text-(--ov-ink)/55">{t('lookup_note_label')}</div>
          <p className="mt-1 text-sm leading-relaxed text-(--ov-ink)">{record.adminNote}</p>
        </div>
      ) : null}

      {/* After the offer: financing (car), ownership transfer (car), delivery (all), then the completed state. */}
      {record.financing && <FinancingCard financing={record.financing} />}
      {postOffer && record.installmentType === 'car' && record.ownershipTransfer && <StageTracker kind="ownership" block={record.ownershipTransfer} />}
      {postOffer && record.delivery && <StageTracker kind="delivery" block={record.delivery} />}
      {record.completedAt && <CompletedBanner date={record.completedAt} />}

      {/* No push for progress: the customer re-checks on demand. */}
      {!record.completedAt && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-(--ov-accent) hover:underline disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-3.5 w-3.5${refreshing ? ' animate-spin' : ''}`} aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 4v5h-5" />
          </svg>
          {refreshing ? tl('track_searching') : tl('track_refresh')}
        </button>
      )}
    </div>
  );
}

/** Status lookup by mobile number (GET /api/v1/public/ovfle/lookup/{phone} via a Server Action). */
export function RequestTracker() {
  const phoneLocale = useLocale() === 'ar' ? 'ar' : 'en';
  const t = useTranslations('Installments');
  const tl = useTranslations('Installments.landing');
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [record, setRecord] = useState<InstallmentLookupRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const lastPhone = useRef<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = await phoneRef.current?.validate();
    if (!phone) return;
    lastPhone.current = phone;
    setLoading(true);
    setNotFound(false);
    setRecord(null);
    try {
      const result = await lookupInstallmentRequest(phone);
      if (result.status === 'found') setRecord(result.record);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Re-runs the same lookup and keeps the current result on screen while it loads.
  const refresh = async () => {
    if (!lastPhone.current || refreshing) return;
    setRefreshing(true);
    try {
      const result = await lookupInstallmentRequest(lastPhone.current);
      if (result.status === 'found') setRecord(result.record);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
        <div className="min-w-0 flex-1">
          <label htmlFor="ov-track-phone" className="sr-only">
            {t('phone')}
          </label>
          <PhoneInput ref={phoneRef} id="ov-track-phone" name="track_phone" errorId="ov-track-phone-error" required dropdownInBody locale={phoneLocale} className="ov-field" />
        </div>
        <button type="submit" disabled={loading} className="ov-btn ov-btn-primary shrink-0">
          <Icon name="search" className="h-4 w-4" strokeWidth={2.2} />
          {loading ? tl('track_searching') : t('lookup_button')}
        </button>
      </form>
      <p id="ov-track-phone-error" className="mt-2 hidden text-xs font-medium text-(--ov-danger)">
        {t('phone_invalid')}
      </p>
      {notFound && <p className="mt-3 text-sm font-medium text-(--ov-danger)">{t('lookup_not_found')}</p>}
      {record && <TrackResult record={record} onRefresh={refresh} refreshing={refreshing} />}
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { PhoneInput, type PhoneInputHandle } from '@/components/portal';
import { decideResalePrice, lookupResale } from '../api/actions';
import type { ResaleLookup } from '../api/schemas';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

const FOLDER_ICON = (
  <>
    <path d="M20 7h-7l-1-2H4a2 2 0 0 0-2 2v10a3 3 0 0 0 3 3h13a3 3 0 0 0 3-3V9a2 2 0 0 0-2-2z" />
    <path d="M7 15h6" />
  </>
);

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{children}</span>
    </div>
  );
}

type DecisionMessage = { tone: 'success' | 'error'; text: string } | null;

function PriceDecision({ data, onDecided }: { data: ResaleLookup; onDecided: () => void }) {
  const t = useTranslations('Resale');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<DecisionMessage>(null);

  const priceType = data.awaiting_initial_decision ? 'initial' : 'final';
  const price = priceType === 'initial' ? data.initial_price : data.final_price;
  const title = priceType === 'initial' ? t('awaiting_initial_price_title') : t('awaiting_final_price_title');
  const hint = priceType === 'initial' ? t('awaiting_initial_price_hint') : t('awaiting_final_price_hint');

  const submitDecision = async (decision: 'approve' | 'reject') => {
    if (decision === 'reject' && !window.confirm(t('confirm_reject_price'))) return;
    setBusy(true);
    let outcome: Awaited<ReturnType<typeof decideResalePrice>>;
    try {
      outcome = await decideResalePrice({
        phone: data.customer_phone ?? '',
        request_number: data.request_number,
        price_type: priceType,
        decision,
      });
    } catch {
      outcome = { status: 'error', kind: 'failed' };
    }
    if (outcome.status !== 'success') {
      setMessage({ tone: 'error', text: outcome.kind === 'not_configured' ? t('decision_unavailable') : t('decision_error') });
      setBusy(false);
      return;
    }
    setDone(true);
    setMessage({ tone: 'success', text: decision === 'approve' ? t('decision_approved_success') : t('decision_rejected_success') });
    // Old page: re-runs the lookup by request number after 900ms to show the new stage.
    window.setTimeout(onDecided, 900);
  };

  return (
    <div className="mt-1 mb-3 rounded-2xl border border-accent-200 bg-accent-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-900">{title}</span>
        <span className="text-lg font-extrabold text-accent-600">
          {price} {t('sar')}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      {!done && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void submitDecision('approve')}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            {t('approve_price_button')}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submitDecision('reject')}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-rose-100 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-200"
          >
            {t('reject_price_button')}
          </button>
        </div>
      )}
      {message && (
        <div className={`mt-2 text-xs font-semibold ${message.tone === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{message.text}</div>
      )}
    </div>
  );
}

function LookupModal({ data, onClose, onRefresh }: { data: ResaleLookup | null; onClose: () => void; onRefresh: (requestNumber: string) => void }) {
  const t = useTranslations('Resale');

  useEffect(() => {
    if (!data) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [data, onClose]);

  if (!data) return null;

  const device = [data.brand, data.model].filter(Boolean).join(' - ');
  const statusStyle = (data.status && STATUS_STYLES[data.status]) || 'bg-slate-100 text-slate-700';
  const statusLabels: Record<string, string> = {
    pending: t('status_pending'),
    approved: t('status_approved'),
    rejected: t('status_rejected'),
  };
  const statusLabel = (data.status && statusLabels[data.status]) || data.status;

  let extra: ReactNode = null;
  if (data.closed) {
    extra = (
      <>
        <div className="mt-1 mb-3 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5">
          <span className="text-xs font-bold text-rose-700">{t('lookup_closed_badge')}</span>
        </div>
        {data.closed_reason_label && <Row label={t('lookup_closed_reason_label')}>{data.closed_reason_label}</Row>}
        {data.discount_code ? (
          <Row label={t('settlement_discount_code_label')}>
            <span className="text-accent-600">{data.discount_code}</span>
          </Row>
        ) : data.transfer_receipt_url ? (
          <Row label={t('settlement_transfer_receipt_label')}>
            <a href={data.transfer_receipt_url} target="_blank" rel="noopener" className="text-accent-600 underline">
              {t('settlement_transfer_receipt_link')}
            </a>
          </Row>
        ) : null}
      </>
    );
  } else if (data.awaiting_initial_decision || data.awaiting_final_decision) {
    extra = <PriceDecision key={`${data.request_number}-${data.stage}`} data={data} onDecided={() => onRefresh(data.request_number)} />;
  } else if (data.stage_label) {
    extra = <Row label={t('lookup_stage_label')}>{data.stage_label}</Row>;
  }

  return (
    <div id="lookupModal" className="fixed inset-0 z-50" aria-hidden="false" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="wafi-animate-pop w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    {FOLDER_ICON}
                  </svg>
                </span>
                <span className="font-bold">{t('lookup_result_title')}</span>
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
            {extra}
            <Row label={t('lookup_customer_name')}>{data.customer_name}</Row>
            <Row label={t('lookup_customer_phone')}>{data.customer_phone}</Row>
            <Row label={t('lookup_device')}>{device}</Row>
            <Row label={t('lookup_status')}>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle}`}>{statusLabel}</span>
            </Row>
            <Row label={t('lookup_submitted_at')}>{data.submitted_at}</Row>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Check your request" box + result modal (old #lookupForm / #lookupModal inline script). */
export function ResaleLookupBox() {
  const t = useTranslations('Resale');
  const phoneRef = useRef<PhoneInputHandle>(null);
  const [notFound, setNotFound] = useState(false);
  const [result, setResult] = useState<ResaleLookup | null>(null);
  const [busy, setBusy] = useState(false);

  const runLookup = useCallback(async (value: string) => {
    setNotFound(false);
    setBusy(true);
    try {
      const outcome = await lookupResale(value);
      if (outcome.found) setResult(outcome.result);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setBusy(false);
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = await phoneRef.current?.validate();
    if (!phone) return;
    await runLookup(phone);
  };

  const close = useCallback(() => setResult(null), []);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-bold text-slate-700">{t('lookup_title')}</div>
        <form id="lookupForm" className="mt-3 space-y-2" onSubmit={(event) => void onSubmit(event)}>
          <PhoneInput
            ref={phoneRef}
            name="lookup_phone"
            id="lookupInput"
            errorId="lookupPhoneClientError"
            required
            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-accent-400 focus:ring-4 focus:ring-accent-500/15 focus:outline-none"
          />
          <div id="lookupPhoneClientError" className="hidden text-xs text-rose-600">
            {t('phone_invalid')}
          </div>
          <button
            type="submit"
            id="lookupSubmit"
            disabled={busy}
            className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-600"
          >
            {t('lookup_button')}
          </button>
        </form>
        {notFound && <div className="mt-2 text-xs text-rose-600">{t('lookup_not_found')}</div>}
      </div>
      <LookupModal data={result} onClose={close} onRefresh={(requestNumber) => void runLookup(requestNumber)} />
    </>
  );
}

export { FOLDER_ICON };

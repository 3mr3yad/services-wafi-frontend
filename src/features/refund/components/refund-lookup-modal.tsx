'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect } from 'react';
import type { RefundLookupRecord } from '../api/schemas';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

const STATUS_KEYS = { pending: 'status_pending', approved: 'status_approved', rejected: 'status_rejected' } as const;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{children}</span>
    </div>
  );
}

/** Request status lookup result modal (#lookupModal in refund.blade.php). */
export function RefundLookupModal({ record, onClose }: { record: RefundLookupRecord | null; onClose: () => void }) {
  const t = useTranslations('Refund');

  useEffect(() => {
    if (!record) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [record, onClose]);

  if (!record) return null;

  const statusKey = STATUS_KEYS[record.status as keyof typeof STATUS_KEYS] as (typeof STATUS_KEYS)[keyof typeof STATUS_KEYS] | undefined;
  const statusStyle = STATUS_STYLES[record.status] ?? 'bg-slate-100 text-slate-700';

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
                    <path d="M9 12h6M12 9v6M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
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
            <Row label={t('lookup_full_name')}>{record.fullName}</Row>
            <Row label={t('lookup_product')}>{record.productName}</Row>
            <Row label={t('lookup_status')}>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle}`}>
                {statusKey ? t(statusKey) : record.status}
              </span>
            </Row>
            <Row label={t('lookup_submitted_at')}>{record.submittedAt}</Row>
            {record.adminNote ? (
              <div className="mt-1 border-t border-slate-100 pt-3">
                <span className="text-sm text-slate-500">{t('lookup_note_label')}</span>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{record.adminNote}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

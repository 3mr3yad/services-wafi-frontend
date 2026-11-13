'use client';

import { useLocale, useTranslations } from 'next-intl';
import { DELIVERY_STAGES, OWNERSHIP_STAGES, type TrackDocument, type TrackFinancing, type TrackStage } from '../api/schemas';
import { Icon } from './art';

/** Post-offer tracking blocks of the status lookup (PUBLIC_SERVICES_API.md §6). Each renders nothing when empty. */

function DocumentLinks({ documents }: { documents: TrackDocument[] }) {
  const t = useTranslations('Installments.landing');
  if (documents.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {documents.map((doc) => (
        <li key={doc.key}>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#7DE6EE]/30 bg-[#7DE6EE]/[0.08] px-3.5 py-2 text-xs font-bold text-[#E6FAFC] transition hover:border-[#7DE6EE]/70 hover:bg-[#7DE6EE]/15"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#7DE6EE]" aria-hidden="true">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M12 12v6M9.5 15.5 12 18l2.5-2.5" />
            </svg>
            {t(`track_doc_${doc.key}` as 'track_doc_other')}
            <span className="sr-only">({t('track_doc_open')})</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, icon, children }: { title: string; icon: 'wallet' | 'car' | 'clock'; children: React.ReactNode }) {
  return (
    <section className="mt-5 border-t border-white/10 pt-5">
      <h4 className="flex items-center gap-2 text-sm font-extrabold text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7DE6EE]/10 text-[#7DE6EE]">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        {title}
      </h4>
      {children}
    </section>
  );
}

export function FinancingCard({ financing }: { financing: TrackFinancing }) {
  const t = useTranslations('Installments.landing');
  const locale = useLocale();
  const money = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', { maximumFractionDigits: 2 });
  const rows = [
    { label: t('track_car_value'), value: financing.carValue, kind: 'money' as const },
    { label: t('track_transport_insurance'), value: financing.transportInsuranceCost, kind: 'money' as const },
    { label: t('track_shipping_delivery'), value: financing.shippingDeliveryCost, kind: 'money' as const },
    { label: t('track_contract_duration'), value: financing.contractDuration, kind: 'months' as const },
  ].filter((row) => row.value !== null);

  return (
    <Section title={t('track_financing_title')} icon="wallet">
      {rows.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="rounded-xl bg-white/[0.04] px-3 py-2.5">
              <dt className="text-xs text-[#E6FAFC]/55">{row.label}</dt>
              <dd className="mt-0.5 font-bold text-white">
                {row.kind === 'months'
                  ? t('track_months', { count: row.value ?? 0 })
                  : `${money.format(row.value ?? 0)} ${t('currency')}`}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {financing.totalOffer !== null && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-[#7DE6EE]/25 bg-[#7DE6EE]/[0.07] px-4 py-3">
          <span className="text-sm font-bold text-[#E6FAFC]/80">{t('track_total_offer')}</span>
          <span className="text-lg font-extrabold text-[#7DE6EE]">
            {money.format(financing.totalOffer)} {t('currency')}
          </span>
        </div>
      )}
      <DocumentLinks documents={financing.documents} />
    </Section>
  );
}

/** Shipping-style tracker: done steps filled, the current one highlighted, later ones dimmed. */
export function StageTracker({ kind, block }: { kind: 'ownership' | 'delivery'; block: TrackStage }) {
  const t = useTranslations('Installments.landing');
  const stages: readonly string[] = kind === 'ownership' ? OWNERSHIP_STAGES : DELIVERY_STAGES;
  const current = stages.indexOf(block.stage);
  const finished = current === stages.length - 1;
  const title = kind === 'ownership' ? t('track_ownership_title') : t('track_delivery_title');

  return (
    <Section title={title} icon={kind === 'ownership' ? 'car' : 'clock'}>
      {current === -1 ? (
        // Unknown stage value from a newer backend: show its own (localised) label instead of guessing.
        <p className="mt-3 text-sm font-bold text-[#E6FAFC]">{block.stageLabel ?? block.stage}</p>
      ) : (
        <ol className="relative mt-5 grid grid-cols-4 gap-1" aria-label={title}>
          {/* Track line behind the dots; the filled part grows up to the current step. */}
          <span className="absolute top-4 right-[12.5%] left-[12.5%] h-0.5 rounded bg-white/10" aria-hidden="true" />
          <span
            className="absolute top-4 h-0.5 rounded bg-[#7DE6EE] shadow-[0_0_8px_rgb(125_230_238/0.7)] transition-[width] duration-700 ltr:left-[12.5%] rtl:right-[12.5%]"
            style={{ width: `${(current / (stages.length - 1)) * 75}%` }}
            aria-hidden="true"
          />
          {stages.map((stage, i) => {
            const state = i < current || finished ? 'done' : i === current ? 'current' : 'todo';
            return (
              <li key={stage} className="relative flex flex-col items-center gap-2 text-center" aria-current={state === 'current' ? 'step' : undefined}>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    state === 'done'
                      ? 'bg-[#7DE6EE] text-[#11131A]'
                      : state === 'current'
                        ? 'bg-[#11131A] text-[#7DE6EE] ring-2 ring-[#7DE6EE]'
                        : 'bg-[#1b1e27] text-white/35 ring-1 ring-white/10'
                  }`}
                >
                  {state === 'done' ? <Icon name="check" className="h-4 w-4" strokeWidth={2.6} /> : <span className="text-xs font-extrabold">{i + 1}</span>}
                </span>
                <span className={`text-[11px] leading-snug font-bold sm:text-xs ${state === 'todo' ? 'text-white/40' : 'text-[#E6FAFC]'}`}>
                  {t(`track_${kind}_${stage}` as 'track_delivery_pending')}
                </span>
              </li>
            );
          })}
        </ol>
      )}
      <DocumentLinks documents={block.documents} />
    </Section>
  );
}

export function CompletedBanner({ date }: { date: string }) {
  const t = useTranslations('Installments.landing');
  return (
    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-4" role="status">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#11131A]">
        <Icon name="check" className="h-5 w-5" strokeWidth={2.8} />
      </span>
      <div>
        <div className="font-extrabold text-emerald-200">{t('track_completed_title')}</div>
        <div className="mt-0.5 text-xs text-emerald-100/75">
          {t('track_completed_on')} <span dir="ltr">{date}</span>
        </div>
      </div>
    </div>
  );
}

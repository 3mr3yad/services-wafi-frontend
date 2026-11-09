'use client';

import { type FormEvent, useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { trackRequest } from '../api/track-request';
import type { TrackResult } from '../api/schemas';
import { Icon } from './icon-sprite';

export interface QuickTrackerLabels {
  title: string;
  subtitle: string;
  inputLabel: string;
  placeholder: string;
  submit: string;
  searching: string;
  empty: string;
  modalTitle: string;
  modalClose: string;
  /** Contains "{count}". */
  resultsCount: string;
  dateLabel: string;
  nameLabel: string;
  phoneLabel: string;
  attachmentsLabel: string;
}

const STATUS_COLORS: Record<string, string> = {
  amber: '#f59e0b',
  emerald: '#10b981',
  rose: '#f43f5e',
  blue: '#3b82f6',
  indigo: '#6366f1',
};

function ResultCard({ item, labels }: { item: TrackResult; labels: QuickTrackerLabels }) {
  const color = STATUS_COLORS[item.status_color ?? ''] ?? STATUS_COLORS.blue;
  return (
    <div className="tresult">
      <div className="tresult-head">
        <span className="tresult-tag">{item.service_label}</span>
        <span className="tresult-status" style={{ backgroundColor: color }}>
          {item.status_label || '—'}
        </span>
      </div>
      <div className="tresult-grid">
        <div>
          <span style={{ color: '#8a9ab3' }}>#</span> <strong>{item.request_number}</strong>
        </div>
        <div style={{ textAlign: 'end' }}>
          <span style={{ color: '#8a9ab3' }}>{labels.dateLabel}:</span> <strong>{item.created_at}</strong>
        </div>
        <div>
          <span style={{ color: '#8a9ab3' }}>{labels.nameLabel}:</span> <strong>{item.customer_name}</strong>
        </div>
        <div style={{ textAlign: 'end' }} dir="ltr">
          <span style={{ color: '#8a9ab3' }}>{labels.phoneLabel}:</span> <strong>{item.customer_phone}</strong>
        </div>
      </div>
      {item.details.length > 0 && (
        <div className="tresult-details">
          {item.details.map((detail, index) => (
            <div key={index}>
              <span style={{ color: '#8a9ab3' }}>{detail.label}</span>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>
      )}
      {item.attachments.length > 0 && (
        <>
          <p style={{ margin: '10px 0 6px', fontSize: '11.5px', fontWeight: 800, color: 'var(--blue-600)' }}>{labels.attachmentsLabel}</p>
          <div className="tresult-attachments">
            {item.attachments.map((attachment, index) => (
              <a key={index} href={attachment.url} target="_blank" rel="noopener">
                <img src={attachment.url} alt={attachment.original_filename ?? ''} loading="lazy" />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Unified quick tracker + results modal (home.blade.php "Track" section). */
export function QuickTracker({ labels }: { labels: QuickTrackerLabels }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TrackResult[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    startTransition(async () => {
      const outcome = await trackRequest(value);
      setResults(outcome.results);
      setIsOpen(true);
    });
  };

  const close = () => setIsOpen(false);

  const modal = (
    <div className={`tmodal${isOpen ? ' is-open' : ''}`} id="trackerModal" aria-hidden={!isOpen}>
      <div className="tmodal-backdrop" onClick={close} />
      <div className="tmodal-card">
        <div className="tmodal-head">
          <h3>{labels.modalTitle}</h3>
          <button type="button" className="tmodal-close" aria-label={labels.modalClose} onClick={close}>
            <Icon name="close" style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div style={{ marginTop: 14 }}>
          {results && results.length === 0 && (
            <div style={{ padding: '28px 0', textAlign: 'center', fontSize: 14, color: '#b45309' }}>{labels.empty}</div>
          )}
          {results && results.length > 0 && (
            <>
              <p style={{ margin: '0 0 4px', fontSize: '12.5px', color: 'var(--muted)' }}>
                {labels.resultsCount.replace('{count}', String(results.length))}
              </p>
              {results.map((item, index) => (
                <ResultCard key={`${item.service}-${item.request_number ?? index}`} item={item} labels={labels} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="track" id="tracker" data-reveal="">
      <div className="container">
        <div className="track-card">
          <div className="track-info">
            <div className="icon-bubble">
              <Icon name="doc" />
            </div>
            <div>
              <h2>{labels.title}</h2>
              <p>{labels.subtitle}</p>
            </div>
          </div>
          <form className="track-form" noValidate onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="trackerInput" className="sr-only">
                {labels.inputLabel}
              </label>
              <Icon name="phone" />
              <input
                id="trackerInput"
                type="text"
                required
                dir="ltr"
                placeholder={labels.placeholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending && (
                <svg className="ico" style={{ animation: 'wafi-spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" stroke="none" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              <span>{isPending ? labels.searching : labels.submit}</span>
            </button>
          </form>
        </div>
      </div>
      {/* Results only exist after a client-side search, so document is available here. Portaled out of the
          z-indexed .track section (like the old page, where the modal sat at body level). */}
      {results !== null ? createPortal(modal, document.getElementById('wafi-home-root') ?? document.body) : null}
    </section>
  );
}

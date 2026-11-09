'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { type DialogTab, OPEN_EVENT, type OpenDetail } from './events';
import { OvfleApplyForm } from './ovfle-apply-form';
import { Icon, Wordmark } from './ovfle-art';
import { OvfleTracker } from './ovfle-tracker';

/**
 * The request dialog: every CTA on the page opens it (apply or track tab).
 * Form and tracker stay mounted while closed, so typed data survives closing and reopening.
 */
export function OvfleDialog() {
  const tl = useTranslations('Ovfle.landing');
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<DialogTab>('apply');
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenDetail>).detail;
      lastFocus.current = document.activeElement as HTMLElement | null;
      setTab(detail.tab);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      // Let the phone country dropdown handle its own Escape first.
      if (event.key === 'Escape' && !document.querySelector('.iti__dropdown-content:not(.iti__hide)')) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [open]);

  const tabs: { id: DialogTab; label: string; icon: 'spark' | 'search' }[] = [
    { id: 'apply', label: tl('nav_apply'), icon: 'spark' },
    { id: 'track', label: tl('nav_track'), icon: 'search' },
  ];

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'hidden'}`} role="dialog" aria-modal="true" aria-label={tl('dialog_label')}>
      <div className="absolute inset-0 bg-[#0b0d12]/80 backdrop-blur-md" onClick={() => setOpen(false)} />
      <div className="relative flex min-h-full items-end justify-center sm:items-center sm:p-6">
        <div className="ov-pop relative flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] sm:rounded-[2rem]">
          {/* Brand header + tabs */}
          <div className="ov-texture relative shrink-0 bg-[#11131A] px-5 pt-5 pb-4 sm:px-8 sm:pt-6">
            <div className="flex items-center justify-between gap-3">
              <Wordmark className="text-3xl" />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={tl('dialog_close')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#E6FAFC]/80 hover:border-[#7DE6EE]/60 hover:text-white"
              >
                <Icon name="x" className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-full bg-white/[0.06] p-1.5" role="tablist">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex h-10 items-center justify-center gap-2 rounded-full text-sm font-bold transition ${
                    tab === item.id ? 'bg-[#7DE6EE] text-[#11131A]' : 'text-[#E6FAFC]/70 hover:text-white'
                  }`}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className={tab === 'apply' ? 'p-5 sm:p-8' : 'hidden'} role="tabpanel">
              <OvfleApplyForm />
            </div>
            <div className={tab === 'track' ? 'ov-texture min-h-full bg-[#11131A] p-5 sm:p-8' : 'hidden'} role="tabpanel">
              <h3 className="text-xl font-extrabold text-white">{tl('track_title')}</h3>
              <p className="mt-1.5 mb-6 text-sm text-[#E6FAFC]/60">{tl('track_subtitle')}</p>
              <OvfleTracker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

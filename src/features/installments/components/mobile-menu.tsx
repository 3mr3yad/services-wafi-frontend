'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon } from './art';
import { openRequestDialog } from './events';

export interface MobileMenuItem {
  label: string;
  /** In-page anchor ("#services"), an app route ("/"), or the track dialog. */
  href?: string;
  route?: boolean;
  action?: 'track';
}

/**
 * Header menu for phones / tablets (the inline nav only shows from `lg`). Opens a panel under the sticky header;
 * closes on link click, Escape, outside click or when resized up to desktop.
 */
export function MobileMenu({ items, labels }: { items: MobileMenuItem[]; labels: { open: string; close: string } }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onResize = () => desktop.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);
  const itemClass =
    'flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-start text-base font-bold text-[#E6FAFC]/85 transition hover:bg-[#7DE6EE]/10 hover:text-white';

  return (
    <div ref={root} className="lg:hidden">
      <button
        ref={button}
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#E6FAFC] transition hover:border-[#7DE6EE]/60"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Panel: full width under the 72px header. */}
      <div
        id={panelId}
        hidden={!open}
        className="ov-menu-panel fixed inset-x-0 top-18 z-50 border-b border-[#7DE6EE]/15 bg-[#11131A] px-4 pt-3 pb-5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]"
      >
        <nav className="mx-auto max-w-6xl">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.label}>
                {item.action === 'track' ? (
                  <button
                    type="button"
                    className={itemClass}
                    aria-haspopup="dialog"
                    onClick={() => {
                      close();
                      openRequestDialog({ tab: 'track' });
                    }}
                  >
                    {item.label}
                    <Icon name="search" className="h-4 w-4 text-[#7DE6EE]" />
                  </button>
                ) : item.route ? (
                  <Link href={item.href ?? '/'} className={itemClass} onClick={close}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className={itemClass} onClick={close}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

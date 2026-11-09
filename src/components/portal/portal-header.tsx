'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { Link } from '@/i18n/navigation';

export interface PortalNavLabels {
  home: string;
  services: string;
  protection: string;
  how: string;
  trackNow: string;
  switchLanguage: string;
}

/** True when the page is rendered inside an iframe with ?embed=1 (old landing pages): no header/footer. */
export function useIsEmbedded() {
  const params = useSearchParams();
  const value = params.get('embed');
  return value === '1' || value === 'true';
}

/** Header of the old layouts/public.blade.php: sticky, elevates on scroll, mobile menu. */
export function PortalHeader({ labels }: { labels: PortalNavLabels }) {
  const embedded = useIsEmbedded();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  if (embedded) return null;

  const link = 'wafi-underline rounded-xl px-3 py-2 text-sm font-bold text-white/70 transition hover:text-white';
  const mobileLink = 'rounded-xl px-3 py-2.5 text-sm font-bold text-white/80 hover:bg-white/5';

  return (
    <header
      id="siteHeader"
      className={`sticky top-0 z-40 border-b border-white/5 bg-ink-950/95 backdrop-blur-xl transition-all duration-300${scrolled ? ' shadow-lg shadow-black/20' : ''}`}
    >
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center">
          <img src="/images/logo.png" alt="عالم وافي" style={{ height: 38 }} className="w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className={link}>{labels.home}</Link>
          <Link href="/#services" className={link}>{labels.services}</Link>
          <Link href="/services/protection" className={link}>{labels.protection}</Link>
          <Link href="/#how" className={link}>{labels.how}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#tracker"
            className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-ink-900 transition hover:bg-white/90 sm:inline-flex"
          >
            {labels.trackNow}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <nav className={`${open ? '' : 'hidden '}border-t border-white/5 bg-ink-950 px-4 py-4 sm:px-6 md:hidden lg:px-12`}>
        <div className="flex flex-col gap-1">
          <Link href="/" className={mobileLink}>{labels.home}</Link>
          <Link href="/#services" className={mobileLink}>{labels.services}</Link>
          <Link href="/services/protection" className={mobileLink}>{labels.protection}</Link>
          <Link href="/#how" className={mobileLink}>{labels.how}</Link>
          <Link href="/#tracker" className={mobileLink}>{labels.trackNow}</Link>
          <LocaleSwitcher
            label={labels.switchLanguage}
            targetName={labels.switchLanguage}
            className="mt-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white/80 hover:bg-white/5"
          />
        </div>
      </nav>
    </header>
  );
}

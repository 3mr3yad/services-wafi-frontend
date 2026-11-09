import { getTranslations } from 'next-intl/server';
import { type ReactNode, Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { tajawalArabic, tajawalLatin } from './fonts';
import { EmbedMarker, HideWhenEmbedded, PortalReveal } from './portal-client';
import { PortalHeader } from './portal-header';
import './portal.css';

const POLICY_URL =
  'https://wafi.sa/ar/%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B3%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D8%A9-%D9%88%D8%A7%D9%84%D8%B4%D8%B1%D9%88%D8%B7-%D9%88%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85';

/**
 * The wafiservices portal chrome (old layouts/public.blade.php): header, sticky mobile bar, footer.
 * Shared look for the service pages that came from the old Laravel site. A service that wants a
 * different design simply doesn't use it.
 */
export async function PortalShell({ children }: { children: ReactNode }) {
  const [tl, th] = await Promise.all([getTranslations('Layout'), getTranslations('Home')]);
  const year = new Date().getFullYear();
  const footerLink = 'wafi-underline inline-block w-fit transition hover:text-white';

  const labels = {
    home: tl('nav_home'),
    services: tl('nav_services'),
    protection: tl('nav_protection'),
    how: tl('nav_how'),
    trackNow: th('track_now'),
    switchLanguage: tl('switch_language'),
  };

  return (
    <div className={`wafi-portal ${tajawalLatin.variable} ${tajawalArabic.variable} min-h-screen overflow-x-hidden bg-sky-50 text-slate-900 antialiased`}>
      <Suspense fallback={null}>
        <PortalHeader labels={labels} />
        <EmbedMarker />
      </Suspense>

      {children}

      <Suspense fallback={null}>
        <HideWhenEmbedded>
          <aside
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-white/10 bg-ink-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:hidden"
            aria-label="Quick Actions"
          >
            <Link
              href="/#services"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 py-2.5 text-xs font-black text-white shadow-lg transition-all active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>{th('mobile_sticky_start')}</span>
            </Link>
            <Link
              href="/#tracker"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-black text-white/90 transition-all active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{th('mobile_sticky_track')}</span>
            </Link>
          </aside>

          <footer className="mt-16 border-t border-white/5 bg-ink-900 pb-16 sm:pb-0">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                  <img src="/images/logo.png" alt="عالم وافي" className="h-9 w-auto object-contain" />
                  <p className="mt-4 max-w-xs text-sm leading-7 text-ink-300">{tl('footer_tagline')}</p>
                </div>

                <div>
                  <div className="text-sm font-black text-white">{tl('nav_services')}</div>
                  <nav className="mt-4 flex flex-col gap-2.5 text-sm text-ink-200">
                    <Link href="/services/xleader" className={footerLink}>{tl('nav_xleader')}</Link>
                    <Link href="/services/resale" className={footerLink}>{tl('nav_resale')}</Link>
                    <Link href="/services/refund" className={footerLink}>{tl('nav_refund')}</Link>
                    <Link href="/services/protection" className={footerLink}>{tl('nav_protection')}</Link>
                    <Link href="/services/customer-support-request" className={footerLink}>{tl('nav_customer_support')}</Link>
                  </nav>
                </div>

                <div>
                  <div className="text-sm font-black text-white">{tl('footer_policies_label')}</div>
                  <nav className="mt-4 flex flex-col gap-2.5 text-sm text-ink-200">
                    <a href={POLICY_URL} target="_blank" rel="noopener" className={footerLink}>
                      {tl('footer_terms')}
                    </a>
                  </nav>
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  © {year} عالم وافي. {tl('footer_rights')}.
                </span>
              </div>
            </div>
          </footer>
        </HideWhenEmbedded>
      </Suspense>

      <PortalReveal />
    </div>
  );
}

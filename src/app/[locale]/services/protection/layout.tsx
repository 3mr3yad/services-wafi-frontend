import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { ProtectionShell } from '@/features/protection';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const [t, tm] = await Promise.all([getTranslations({ locale, namespace: 'Protection' }), getTranslations({ locale, namespace: 'Metadata' })]);
  // meta.title already names the brand, so it is used as-is.
  return pageMetadata({ locale, path: '/services/protection', title: t('meta.title'), description: t('meta.description'), siteName: tm('siteName'), image: 'prot', absoluteTitle: true });
}

export const viewport: Viewport = { themeColor: '#080809' };

// The page has its own design (not the portal layout). Texts are passed to client components as props.
export default function ProtectionLayout({ children }: { children: ReactNode }) {
  return <ProtectionShell>{children}</ProtectionShell>;
}

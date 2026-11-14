import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ovfleOrigin } from '@/lib/site/ovfle-host';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { pickMessages } from '@/i18n/pick-messages';
import { brand } from '@/features/installments';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Installments.landing' });
  // Independent brand: absolute title (no parent " - عالم وافي" suffix) and its own preview image.
  return pageMetadata({
    locale,
    // On its own domain (once primary) the page is the site root: https://ovfle.wafi.sa/ar
    ...(ovfleOrigin() ? { origin: ovfleOrigin(), path: '' } : { path: '/services/installments' }),
    title: `${brand.name[locale]} | ${t('meta_tagline')}`,
    description: t('meta_description'),
    siteName: brand.wordmark,
    image: 'ovfle',
    absoluteTitle: true,
  });
}

// Browser UI colour matches the light page header.
export const viewport: Viewport = { themeColor: '#FFFFFF' };

// The installments brand has its own identity, so it doesn't use the wafiservices PortalShell.
export default async function InstallmentsLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  // Layouts can render before the page: set the locale here too, otherwise next-intl falls back to the middleware
  // header, which is absent on the Ovfle domain (proxy rewrite) and would cache the default locale.
  // Root [locale] layout already 404s unknown locales.
  setRequestLocale((await params).locale as Locale);
  const messages = await getMessages();
  return <NextIntlClientProvider messages={pickMessages(messages, ['Errors', 'Portal', 'Installments'])}>{children}</NextIntlClientProvider>;
}

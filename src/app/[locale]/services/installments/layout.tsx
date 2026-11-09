import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { pickMessages } from '@/i18n/pick-messages';
import { brand } from '@/features/installments';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Installments.landing' });
  // Independent brand: absolute title, without the parent " - عالم وافي" template.
  return { title: { absolute: `${brand.name[locale]} | ${t('meta_tagline')}` }, description: t('meta_description') };
}

export const viewport: Viewport = { themeColor: '#11131A' };

// The installments brand has its own identity, so it doesn't use the wafiservices PortalShell.
export default async function InstallmentsLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return <NextIntlClientProvider messages={pickMessages(messages, ['Errors', 'Portal', 'Installments'])}>{children}</NextIntlClientProvider>;
}

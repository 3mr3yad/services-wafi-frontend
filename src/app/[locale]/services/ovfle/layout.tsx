import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { pickMessages } from '@/i18n/pick-messages';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Ovfle.landing' });
  // Own brand: absolute title, without the " - عالم وافي" template.
  return { title: { absolute: t('meta_title') }, description: t('meta_description') };
}

export const viewport: Viewport = { themeColor: '#11131A' };

// Ovfle has its own brand identity, so it doesn't use the wafiservices PortalShell.
export default async function OvfleLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return <NextIntlClientProvider messages={pickMessages(messages, ['Errors', 'Ovfle'])}>{children}</NextIntlClientProvider>;
}

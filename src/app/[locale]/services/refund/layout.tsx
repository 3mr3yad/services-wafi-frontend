import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { PortalShell } from '@/components/portal/portal-shell';
import { pickMessages } from '@/i18n/pick-messages';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const [t, tm] = await Promise.all([getTranslations({ locale, namespace: 'Refund' }), getTranslations({ locale, namespace: 'Metadata' })]);
  return pageMetadata({ locale, path: '/services/refund', title: t('title'), description: t('meta_description'), siteName: tm('siteName') });
}

export default async function RefundLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return (
    <PortalShell>
      <NextIntlClientProvider messages={pickMessages(messages, ['Errors', 'Portal', 'Refund'])}>{children}</NextIntlClientProvider>
    </PortalShell>
  );
}

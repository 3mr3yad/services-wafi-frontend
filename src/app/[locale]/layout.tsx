import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { pickMessages } from '@/i18n/pick-messages';
import { localeDirection, routing } from '@/i18n/routing';
import { cairoArabic, cairoLatin } from '@/styles/fonts';
import '@/styles/globals.css';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    // Production must set NEXT_PUBLIC_SITE_URL (https://...): previews need absolute https image URLs.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    // Defaults for routes without their own metadata (e.g. 404); pages override them via pageMetadata().
    ...pageMetadata({ locale, path: '', title: t('siteName'), description: t('description'), siteName: t('siteName') }),
    title: { default: t('siteName'), template: `%s - ${t('siteName')}` },
  };
}

// Client components only receive the namespaces listed here.
const CLIENT_NAMESPACES = ['Errors', 'Portal'] as const;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} dir={localeDirection[locale]} className={`${cairoArabic.variable} ${cairoLatin.variable}`}>
      <body className="min-h-dvh">
        <NextIntlClientProvider messages={pickMessages(messages, CLIENT_NAMESPACES)}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

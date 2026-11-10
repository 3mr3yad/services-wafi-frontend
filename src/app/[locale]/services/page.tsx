import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ServicesPage } from '@/features/main-site';
import type { Locale } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, tl, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'Home' }),
    getTranslations({ locale, namespace: 'Layout' }),
    getTranslations({ locale, namespace: 'Metadata' }),
  ]);
  return pageMetadata({ locale, path: '/services', title: tl('nav_services'), description: t('services_page_subtitle'), siteName: tm('siteName') });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPage />;
}

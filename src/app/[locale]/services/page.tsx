import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ServicesPage } from '@/features/main-site';
import type { Locale } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, tl] = await Promise.all([getTranslations({ locale, namespace: 'Home' }), getTranslations({ locale, namespace: 'Layout' })]);
  return { title: tl('nav_services'), description: t('services_page_subtitle') };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPage />;
}

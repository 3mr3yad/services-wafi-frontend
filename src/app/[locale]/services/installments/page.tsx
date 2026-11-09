import { setRequestLocale } from 'next-intl/server';
import { InstallmentsLanding } from '@/features/installments';
import type { Locale } from '@/i18n/routing';

export default async function InstallmentsRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InstallmentsLanding />;
}

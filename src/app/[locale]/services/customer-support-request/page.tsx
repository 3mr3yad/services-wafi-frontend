import { setRequestLocale } from 'next-intl/server';
import { CustomerSupportPage } from '@/features/customer-support-request';
import type { Locale } from '@/i18n/routing';

export default async function CustomerSupportRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CustomerSupportPage />;
}

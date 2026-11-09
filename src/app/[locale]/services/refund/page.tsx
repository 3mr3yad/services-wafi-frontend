import { setRequestLocale } from 'next-intl/server';
import { RefundPage } from '@/features/refund';
import type { Locale } from '@/i18n/routing';

export default async function RefundRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RefundPage />;
}

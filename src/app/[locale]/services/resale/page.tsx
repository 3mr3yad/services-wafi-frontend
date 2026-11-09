import { setRequestLocale } from 'next-intl/server';
import { ResalePage } from '@/features/resale';
import type { Locale } from '@/i18n/routing';

export default async function ResaleRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ResalePage />;
}

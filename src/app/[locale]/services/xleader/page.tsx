import { setRequestLocale } from 'next-intl/server';
import { XleaderPage } from '@/features/xleader';
import type { Locale } from '@/i18n/routing';

export default async function XleaderRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <XleaderPage />;
}

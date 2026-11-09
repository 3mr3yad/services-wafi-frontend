import { setRequestLocale } from 'next-intl/server';
import { OvfleLanding } from '@/features/ovfle';
import type { Locale } from '@/i18n/routing';

export default async function OvfleRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OvfleLanding />;
}

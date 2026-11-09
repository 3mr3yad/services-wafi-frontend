import { setRequestLocale } from 'next-intl/server';
import { ProtectionLanding } from '@/features/protection';
import type { Locale } from '@/i18n/routing';

export default async function ProtectionPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProtectionLanding />;
}

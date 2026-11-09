import { setRequestLocale } from 'next-intl/server';
import { FollowerGiftsPage } from '@/features/follower-gifts';
import type { Locale } from '@/i18n/routing';

export default async function FollowerGiftsRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FollowerGiftsPage />;
}

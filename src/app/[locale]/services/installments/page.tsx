import { setRequestLocale } from 'next-intl/server';
import { brand, InstallmentsLanding } from '@/features/installments';
import type { Locale } from '@/i18n/routing';

export default async function InstallmentsRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ theme?: string | string[] }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  // ?theme=light|dark previews the other theme while brand.themePreview is on; otherwise brand.theme decides.
  const requested = typeof query.theme === 'string' ? query.theme : undefined;
  const theme = brand.themePreview && (requested === 'light' || requested === 'dark') ? requested : brand.theme;
  return <InstallmentsLanding theme={theme} />;
}

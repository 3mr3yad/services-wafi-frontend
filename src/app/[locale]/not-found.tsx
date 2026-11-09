import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function LocaleNotFound() {
  const t = await getTranslations('NotFound');

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-brand text-6xl font-bold">404</p>
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-muted max-w-sm">{t('description')}</p>
      <Link href="/" className="rounded-brand bg-brand text-brand-foreground mt-2 px-5 py-2.5 text-sm font-medium">
        {t('backHome')}
      </Link>
    </main>
  );
}

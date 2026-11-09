'use client';

import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  onRetry?: () => void;
  className?: string;
}

/** Generic, theme-aware error message used by route error boundaries. */
export function ErrorState({ onRetry, className }: ErrorStateProps) {
  const t = useTranslations('Errors');

  return (
    <div role="alert" className={`mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center ${className ?? ''}`}>
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <p className="text-muted">{t('description')}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-brand bg-brand text-brand-foreground mt-2 px-5 py-2.5 text-sm font-medium transition hover:opacity-90"
        >
          {t('retry')}
        </button>
      ) : null}
    </div>
  );
}

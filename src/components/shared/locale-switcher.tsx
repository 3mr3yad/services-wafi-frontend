'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

interface LocaleSwitcherProps {
  /** Accessible label, e.g. "Change language". */
  label: string;
  /** Visible text: the other language's own name. */
  targetName: string;
  className?: string;
}

/**
 * Switches language while keeping the current page: only the locale segment changes.
 * Unstyled by default; each area passes its own className.
 */
export function LocaleSwitcher({ label, targetName, className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const target = routing.locales.find((candidate) => candidate !== locale) ?? routing.defaultLocale;

  return (
    <Link href={pathname} locale={target} aria-label={label} hrefLang={target} lang={target} className={className}>
      {targetName}
    </Link>
  );
}

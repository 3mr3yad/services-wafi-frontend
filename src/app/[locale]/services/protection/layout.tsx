import type { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { ProtectionShell } from '@/features/protection';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Protection' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export const viewport: Viewport = { themeColor: '#080809' };

// The page has its own design (not the portal layout). Texts are passed to client components as props.
export default function ProtectionLayout({ children }: { children: ReactNode }) {
  return <ProtectionShell>{children}</ProtectionShell>;
}

import type { Metadata } from 'next';
import { type Locale, routing } from '@/i18n/routing';

/**
 * Link-preview images in /public/og (1200×630 JPEG, ~100KB each: WhatsApp drops images that are too heavy).
 * Regenerate them when the artwork changes; keep the same names.
 */
export type ShareImage = 'wafi' | 'ovfle' | 'prot';

const OG_LOCALE: Record<Locale, string> = { ar: 'ar_SA', en: 'en_US' };

interface PageMetadataInput {
  locale: Locale;
  /** Path after the locale, e.g. '' for the homepage or '/services/resale'. */
  path: string;
  /** Page title. The root layout's template appends " - <site name>" unless `absoluteTitle` is set. */
  title: string;
  description: string;
  siteName: string;
  image?: ShareImage;
  /** Use `title` as-is (no " - <site name>" suffix), e.g. for an independent brand. */
  absoluteTitle?: boolean;
  /** Absolute origin when the page lives on another host than metadataBase (e.g. https://ovfle.wafi.sa). */
  origin?: string | null;
}

/**
 * Full metadata for a page, including the Open Graph / Twitter tags that WhatsApp, Telegram, X, Slack,
 * iMessage... read for the link preview. Next merges `openGraph` shallowly (a child segment that sets it replaces
 * the parent's completely), so every page builds the whole block here instead of relying on the layout's.
 * Relative URLs are resolved against `metadataBase` (NEXT_PUBLIC_SITE_URL) set in app/[locale]/layout.tsx.
 */
export function pageMetadata({ locale, path, title, description, siteName, image = 'wafi', absoluteTitle = false, origin }: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle || title === siteName ? title : `${title} - ${siteName}`;
  const base = origin ?? '';
  const url = `${base}/${locale}${path}`;
  const imageUrl = `/og/${image}-${locale}.jpg`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])), 'x-default': `${base}/${routing.defaultLocale}${path}` },
    },
    openGraph: {
      type: 'website',
      siteName,
      title: fullTitle,
      description,
      url,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle, type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

import type { Locale } from '@/i18n/routing';

export type LocalizedText = Record<Locale, string>;

/**
 * What a service declares about itself. Kept tiny and free of UI imports,
 * so the registry, the main site and the request proxy can read it cheaply.
 */
export interface ServiceManifest {
  /** URL segment: /{locale}/services/{slug} */
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Brand color shown on the main site's service card. The service's own UI defines its full theme. */
  accentColor: string;
  enabled: boolean;
  access: {
    /** Enforced by the proxy once the auth contract is wired. */
    requiresAuth: boolean;
  };
  /** Loads this service's translation namespace for a locale. */
  loadMessages: (locale: Locale) => Promise<Record<string, unknown>>;
}

export function defineService<const T extends ServiceManifest>(manifest: T): T {
  return manifest;
}

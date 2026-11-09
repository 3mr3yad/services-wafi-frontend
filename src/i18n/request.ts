import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { services } from '@/services/registry';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Shared UI strings + each service's own namespace.
  // Server-side only: client components receive just the namespaces passed to them explicitly.
  const [common, ...serviceMessages] = await Promise.all([
    import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
    ...services.map((service) => service.loadMessages(locale)),
  ]);

  return {
    locale,
    messages: Object.assign({}, common, ...serviceMessages),
  };
});

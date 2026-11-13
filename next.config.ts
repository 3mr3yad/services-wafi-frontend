import path from 'node:path';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';

/**
 * next-intl request config. `next-intl/plugin` is NOT used: its module eagerly loads `@swc/core` (only needed for
 * its experimental message extraction, which we don't use), and since @swc/core 1.16.21 the Linux binary
 * self-materialises into a cache whose permission checks fail on the Cloudflare build image
 * (ERR_SWC_NATIVE_CACHE, "Failed to load next.config.ts"). For our options the plugin only adds the
 * `next-intl/config` alias below (Turbopack + webpack); same values as next-intl 4.14 `getNextConfig`.
 * If you later need plugin-only features (experimental.messages / extract / createMessagesDeclaration), revisit this.
 */
const I18N_REQUEST_CONFIG = './src/i18n/request.ts';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    // Turbopack aliases must be relative paths.
    resolveAlias: { 'next-intl/config': I18N_REQUEST_CONFIG },
  },
  webpack(config: { context?: string; resolve?: { alias?: Record<string, string> } }) {
    // Webpack (e.g. `next build --webpack`) needs an absolute path.
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias['next-intl/config'] = path.resolve(config.context ?? process.cwd(), I18N_REQUEST_CONFIG);
    return config;
  },
  experimental: {
    serverActions: {
      // Forms forward uploads to the backend through Server Actions: refund (1 file, 5MB),
      // resale / xleader (7 photos x 5MB), customer support (up to 10 files x 10MB).
      // Cloudflare Workers itself caps request bodies at 100MB (Free/Pro plans).
      bodySizeLimit: '100mb',
    },
  },
  async redirects() {
    return [
      // The old wafii.sa Ovfle page 301s to /{locale}/services/ovfle (wafi-service FrontendRedirect);
      // the page lives at /services/installments here. Query strings are kept automatically.
      { source: '/:locale(ar|en)/services/ovfle', destination: '/:locale/services/installments', permanent: true },
    ];
  },
};

export default nextConfig;

// Exposes Cloudflare bindings (vars, secrets) to `next dev`. Development only.
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}

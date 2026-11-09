import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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

export default withNextIntl(nextConfig);

// Exposes Cloudflare bindings (vars, secrets) to `next dev`. Development only.
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}

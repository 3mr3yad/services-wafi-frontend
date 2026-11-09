import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Architecture boundaries (see docs/ARCHITECTURE.md):
 * - Shared code (lib, components, i18n) may not import any feature.
 * - Routes import a feature only through its public index.ts.
 * - The service registry imports only feature manifests.
 * - A feature module may not import another feature module.
 *
 * When adding a service, add its slug to FEATURE_MODULES.
 */
const FEATURE_MODULES = [
  'main-site',
  'refund',
  'resale',
  'xleader',
  'customer-support-request',
  'protection',
  'follower-gifts',
  'installments',
];

const restrict = (regex, message) => ['error', { patterns: [{ regex, message }] }];

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: ['.next/**', '.open-next/**', '.wrangler/**', 'node_modules/**', 'next-env.d.ts', 'cloudflare-env.d.ts'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // Plain <img> on purpose: pages are ported 1:1 and Cloudflare Workers has no Next image optimizer.
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['src/lib/**', 'src/components/**', 'src/i18n/**/*.tsx'],
    rules: {
      'no-restricted-imports': restrict('^@/features/', 'Shared code must not depend on a service.'),
    },
  },
  {
    files: ['src/app/**'],
    rules: {
      'no-restricted-imports': restrict('^@/features/[^/]+/', "Import from the feature's index.ts, not its internals."),
    },
  },
  {
    files: ['src/services/**'],
    rules: {
      'no-restricted-imports': restrict('^@/features/(?![^/]+/manifest$)', 'The registry may import feature manifests only.'),
    },
  },
  ...FEATURE_MODULES.map((slug) => ({
    files: [`src/features/${slug}/**`],
    rules: {
      'no-restricted-imports': restrict(
        `^@/features/(?!${slug}(/|$))`,
        'A feature must not import another feature. Move shared code to src/lib or src/components.',
      ),
    },
  })),
];

export default config;

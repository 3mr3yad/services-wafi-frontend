import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16 request proxy (formerly middleware.ts).
// Today: locale detection and redirects (/ → /ar or /en).
// Next: session refresh and service access rules, once the backend auth contract is available.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};

import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { isOvfleHost, ovfleOrigin } from './lib/site/ovfle-host';

// Next.js 16 request proxy (formerly middleware.ts).
// - Locale handling (/ → /ar) via next-intl.
// - Ovfle on its own (sub)domain (see src/lib/site/ovfle-host.ts): the same Worker serves the installments page
//   at the root of OVFLE_HOST, with clean URLs (/, /ar, /en).
// Next: session refresh and service access rules, once the backend auth contract is available.
const intl = createMiddleware(routing);

const OVFLE_PAGE = '/services/installments';
/** "/", "/ar", "/en" (optional trailing slash). */
const OVFLE_ROOT = /^\/(?:(ar|en)\/?)?$/;
/** The portal path of the page, "/ar/services/installments" (optional trailing slash). */
const OVFLE_PORTAL_PATH = /^\/(ar|en)\/services\/installments\/?$/;

/**
 * Origin the visitor actually used: request.url can carry the server's own host (e.g. in `next dev`).
 * Only the Host header is trusted (not X-Forwarded-Host, which any client can send).
 */
function visitorOrigin(request: NextRequest) {
  const host = request.headers.get('host') ?? request.nextUrl.host;
  return `${request.nextUrl.protocol}//${host}`;
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isOvfleHost(request.headers.get('host'))) {
    const here = visitorOrigin(request);
    // Clean URLs on the Ovfle domain: /ar/services/installments → /ar.
    const portalPath = pathname.match(OVFLE_PORTAL_PATH);
    if (portalPath) return NextResponse.redirect(new URL(`/${portalPath[1]}${search}`, here), 308);

    const root = pathname.match(OVFLE_ROOT);
    if (root) {
      const locale = root[1] ?? routing.defaultLocale;
      // "/" → "/ar" so the address bar always carries the language, like the portal.
      if (!root[1]) return NextResponse.redirect(new URL(`/${locale}${search}`, here), 307);
      // Same locale header next-intl's middleware sets on the portal (that middleware is skipped here).
      const forwarded = new Headers(request.headers);
      forwarded.set('X-NEXT-INTL-LOCALE', locale);
      return NextResponse.rewrite(new URL(`/${locale}${OVFLE_PAGE}${search}`, request.url), { request: { headers: forwarded } });
    }

    // Anything else on the Ovfle domain belongs to the portal (e.g. the complaints page linked from the footer).
    const portal = process.env.NEXT_PUBLIC_SITE_URL;
    if (portal) return NextResponse.redirect(new URL(`${pathname}${search}`, portal), 307);
    return intl(request);
  }

  // Once Ovfle's domain is primary, its old portal address moves there permanently.
  const origin = ovfleOrigin();
  const portalPath = origin ? pathname.match(OVFLE_PORTAL_PATH) : null;
  if (origin && portalPath) return NextResponse.redirect(new URL(`/${portalPath[1]}${search}`, origin), 308);

  return intl(request);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};

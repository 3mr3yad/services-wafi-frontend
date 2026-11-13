/**
 * Ovfle on its own (sub)domain, served by this same Worker.
 *
 * - OVFLE_HOST       e.g. "ovfle.wafi.sa". When a request arrives on this host, "/", "/ar" and "/en" show the
 *                    installments landing page (src/proxy.ts). Harmless while the domain isn't attached yet.
 * - OVFLE_PRIMARY    "true" once the domain is live and verified: canonical / Open Graph URLs point to it and the
 *                    portal path /{locale}/services/installments redirects there. Keep "false" until then.
 *
 * Both are runtime vars (wrangler.jsonc "vars", or .env.local in development). Edge-safe: used by the proxy too.
 * In development "ovfle.localhost:3000" also counts as the Ovfle host (browsers resolve *.localhost locally).
 */
const DEV_HOST = 'ovfle.localhost';

/** Configured Ovfle host without port, or null when not configured. */
export function ovfleHost(): string | null {
  const value = process.env.OVFLE_HOST?.trim().toLowerCase();
  return value ? value.replace(/:\d+$/, '') : null;
}

/** True when the request's Host header is the Ovfle (sub)domain. */
export function isOvfleHost(hostHeader: string | null | undefined): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.trim().toLowerCase().replace(/:\d+$/, '');
  return host === ovfleHost() || host === DEV_HOST;
}

/** True when the Ovfle domain is live and should be the canonical home of the page. */
export function ovflePrimary(): boolean {
  return process.env.OVFLE_PRIMARY === 'true' && ovfleHost() !== null;
}

/** https origin of the Ovfle site when it is primary, otherwise null. */
export function ovfleOrigin(): string | null {
  return ovflePrimary() ? `https://${ovfleHost()}` : null;
}

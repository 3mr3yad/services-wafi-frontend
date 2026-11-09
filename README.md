# Wafi Services Frontend

Multi-service platform: one main website plus independent services, built with Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4 and next-intl (Arabic RTL / English LTR). It deploys to Cloudflare Workers through OpenNext.

## Run locally

```bash
pnpm install
cp .env.example .env.local   # points at the production backend; API_MOCKS=true fills missing data in dev
pnpm dev                     # http://localhost:3000 → redirects to /ar
```

| URL | What |
| --- | --- |
| `/ar`, `/en` | Homepage (ported 1:1 from the old wafiservices home) |
| `/{ar,en}/services/refund` | Voucher cancellation |
| `/{ar,en}/services/resale` | Device trade-in |
| `/{ar,en}/services/xleader` | Full protection warranty (Xleader) |
| `/{ar,en}/services/customer-support-request` | Customer support + tracking |
| `/{ar,en}/services/follower-gifts` | Follower gifts form |
| `/{ar,en}/services/ovfle` | Phone & car installments (Ovfle) — first service on `/api/v1/public` |
| `/{ar,en}/services/protection` | Protection packages landing (Arabic only, own design) |

Other scripts: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm cf:preview` (runs the Cloudflare Worker locally), `pnpm cf:deploy`.

## Folder structure

```
src/
├── app/[locale]/
│   ├── layout.tsx               # the only root layout: <html lang dir>, fonts, providers
│   ├── (main)/                  # main website: its own header/footer
│   └── services/<slug>/         # thin route files for each service
├── features/                    # one folder per module; all UI + logic lives here
│   ├── main-site/
│   └── <slug>/
│       ├── manifest.ts          # slug, names, access rules (no UI imports)
│       ├── index.ts             # public surface: routes import only this
│       ├── theme.css            # the service's own design tokens
│       ├── messages/{ar,en}.json
│       ├── api/                 # endpoint functions + Zod schemas
│       ├── mocks/               # labelled mock data (development only)
│       └── components/
├── components/shared/           # theme-neutral shared pieces (locale switcher, error state…)
├── components/portal/           # old wafiservices portal layout + partials (shell, phone input, wizard…)
├── lib/
│   ├── api/                     # central HTTP client + ApiError
│   ├── config/env.ts            # Zod-validated server env
│   └── services/manifest.ts     # ServiceManifest type
├── services/registry.ts         # list of all services
├── i18n/                        # routing, request config, shared messages
├── proxy.ts                     # Next 16 proxy: locale redirects (auth guards later)
└── styles/                      # globals.css (tokens → Tailwind), fonts.ts
```

### Rules (enforced by `pnpm lint`)

- A service never imports another service.
- `lib/` and `components/` never import a service.
- Routes import a service only through its `index.ts`.
- The registry imports only `manifest.ts` files.

### Theming

The homepage keeps its original hand-written CSS (scoped under `.wafi-home`). Services that came from the old Laravel portal render inside `PortalShell` (`components/portal`) and use the old Tailwind scales (`brand-*`, `accent-*`, `ink-*`) defined in `styles/globals.css`. Protection has its own scoped stylesheet. Fonts are self-hosted from npm, so builds don't depend on Google Fonts.

## Add a new service

1. Create `src/features/<slug>` (see `src/features/follower-gifts` for the smallest example): `manifest.ts`, `messages/{ar,en}.json` with a new top-level namespace, `components/`, `api/`, `index.ts`.
2. Add `src/app/[locale]/services/<slug>/{layout,page,error}.tsx` importing only from `@/features/<slug>`.
3. Add the manifest to `src/services/registry.ts`.
4. Add the slug to `FEATURE_MODULES` in `eslint.config.mjs`.

## Backend

- Production backend: the Laravel app `wafi-service`, base URL in `API_BASE_URL`. All calls go through `src/lib/api/client.ts`, server-side only (Server Actions / Server Components); the browser never calls the backend. The client forwards `X-Client-IP` and, if set, `X-Frontend-Key` (`FRONTEND_API_KEY`, secret).
- Wired today: Ovfle submit + lookup (`/api/v1/public/ovfle`), and the existing JSON lookups (`/track-request`, `/refund|resale|xleader/lookup/{v}`, `/customer-support-request/lookup`).
- Pending `/api/v1/public/*` (being built in the Laravel project): form submissions, resale price decision, support rating, resale form data, xleader brands. Each is marked `TODO(backend-contract)` with its path set to `null`; until then the UI shows a "not available yet" message, and missing render-time data uses labelled mocks in development only.
- Protection page videos still stream from the old site (`/new-home/media/videos`); move them to R2 before the old site is retired.

Full architecture: see the architecture document shared with the team.

/**
 * Brand configuration for Ovfle — the car, smartphone and electronic-device installments brand.
 * Visual identity follows "ovfle branding.pdf": navy #11131A, sky #7DE6EE, ice #E6FAFC, white;
 * Tajawal (Arabic) + Poppins Rounded (Latin). Kept visually independent from the parent عالم وافي.
 * Page copy follows the "صفحة الهبوط أوفل" brief (2026-11-12).
 *
 * Everything commercial lives here or in messages/{ar,en}.json, so it can be changed without code edits.
 */
/** Partner logo per page language, or null to show the name as text. */
type PartnerLogo = { ar: string; en: string } | null;

export const BRAND = {
  /** Brand name in running text (Arabic usage from the brand book: "أوفل"). */
  name: { ar: 'أوفل', en: 'Ovfle' },

  /** The logo is the Latin wordmark in both languages (as in the brand book). */
  wordmark: 'Ovfle',

  /** "A brand owned by عالم وافي" — confirmed by the 2026-11-12 brief (about section, "why Ovfle", footer). */
  showParentAttribution: true,

  /**
   * Page theme (light chosen 2026-11-14). "dark" = the original navy look with the night photos; "light" = light
   * surfaces with the daylight photos in /images/ovfle/light (footer stays dark).
   * Any visitor can preview the other one with ?theme=light / ?theme=dark while `themePreview` is on.
   */
  theme: 'light' as 'dark' | 'light',
  /** Shows a small floating dark/light switch (for choosing the theme). Turn off once decided. */
  themePreview: false,

  /** Shows the "submitting an application is not a financing approval" notices across the page. Keep true. */
  showApprovalDisclaimer: true,

  /**
   * Car financing partners named in the brief. Until the official logo files arrive the names are shown as text
   * badges (logo: null). Files live in /public/images/ovfle/partners/, one per language (ALJ has an Arabic and an
   * English lockup). Source: Mora = its X profile image; ALJ = the user-provided SVG, split into its two lines.
   */
  partners: [
    // cars: true = car financing partner (also shown on the cars slide). Others appear in the partners strip only.
    { id: 'mora', cars: true, name: { ar: 'مورا', en: 'Mora' }, logo: { ar: '/images/ovfle/partners/mora.png', en: '/images/ovfle/partners/mora.png' } as PartnerLogo },
    { id: 'alj', cars: true, name: { ar: 'عبد اللطيف جميل للتمويل', en: 'Abdul Latif Jameel' }, logo: { ar: '/images/ovfle/partners/alj-finance-ar.png', en: '/images/ovfle/partners/alj-en.png' } as PartnerLogo },
    { id: 'tabby', cars: false, name: { ar: 'تابي', en: 'Tabby' }, logo: { ar: '/images/ovfle/partners/tabby.png', en: '/images/ovfle/partners/tabby.png' } as PartnerLogo },
    { id: 'tamara', cars: false, name: { ar: 'تمارا', en: 'Tamara' }, logo: { ar: '/images/ovfle/partners/tamara.png', en: '/images/ovfle/partners/tamara.png' } as PartnerLogo },
    { id: 'emkan', cars: false, name: { ar: 'إمكان للتمويل', en: 'Emkan Finance' }, logo: { ar: '/images/ovfle/partners/emkan.png', en: '/images/ovfle/partners/emkan.png' } as PartnerLogo },
    { id: 'neo', cars: false, name: { ar: 'نيو', en: 'NEO' }, logo: { ar: '/images/ovfle/partners/neo.png', en: '/images/ovfle/partners/neo.png' } as PartnerLogo },
    { id: 'orville', cars: false, name: { ar: 'أورفل', en: 'Orville' }, logo: { ar: '/images/ovfle/partners/orville.png', en: '/images/ovfle/partners/orville.png' } as PartnerLogo },
    { id: 'wafi', cars: false, name: { ar: 'عالم وافي', en: 'Wafi World' }, logo: { ar: '/images/ovfle/partners/wafi.svg', en: '/images/ovfle/partners/wafi.svg' } as PartnerLogo },
  ],

  /**
   * Smartphones are sold for CASH only (decided 2026-11-14) — no Ovfle installments for phones. The phones card
   * links out to this purchase page (opens in a new tab). TODO: confirm the exact URL with the business.
   */
  phonePurchaseUrl: 'https://wafi.sa' as string | null,

  /** Footer "company information". null = not provided yet → the row is hidden (never show placeholders). */
  company: {
    commercialRegistration: null as string | null,
    vatNumber: null as string | null,
    /** عالم وافي unified contact number (from the brief). */
    unifiedNumber: '0115001560' as string | null,
  },
} as const;

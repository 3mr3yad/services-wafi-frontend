/**
 * Brand configuration for Ovfle — the car + smartphone installments brand (confirmed 2026-11-09).
 * Visual identity follows "ovfle branding.pdf": navy #11131A, sky #7DE6EE, ice #E6FAFC, white;
 * Tajawal (Arabic) + Poppins Rounded (Latin). Kept visually independent from the parent عالم وافي.
 *
 * Everything commercial lives here or in messages/{ar,en}.json, so it can be changed without code edits.
 */
export const BRAND = {
  /** Brand name in running text (Arabic usage from the brand book: "أوفل"). */
  name: { ar: 'أوفل', en: 'Ovfle' },

  /** The logo is the Latin wordmark in both languages (as in the brand book). */
  wordmark: 'Ovfle',

  /**
   * Footer line "إحدى العلامات التابعة لعالم وافي" (+ a link back to the Wafi services portal).
   * Keep false until the legal and commercial relationship has been confirmed.
   */
  showParentAttribution: false,

  /** Shows the "submitting an application is not a financing approval" notices across the page. Keep true. */
  showApprovalDisclaimer: true,
} as const;

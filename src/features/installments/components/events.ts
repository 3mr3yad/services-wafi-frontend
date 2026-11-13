/** Every CTA on the installments landing page opens the request dialog through this window event. */
export const OPEN_EVENT = 'installments:open';

export type DialogTab = 'apply' | 'track';

/** Installment types accepted by POST /api/v1/public/ovfle. */
export type InstallmentKind = 'phone' | 'device' | 'car';

export interface OpenDetail {
  tab: DialogTab;
  /** Preselects the installment type in the form (from the service cards / slides). */
  type?: InstallmentKind;
}

export function openRequestDialog(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>(OPEN_EVENT, { detail }));
}

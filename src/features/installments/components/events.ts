/** Every CTA on the installments landing page opens the request dialog through this window event. */
export const OPEN_EVENT = 'installments:open';

export type DialogTab = 'apply' | 'track';

export interface OpenDetail {
  tab: DialogTab;
  /** Preselects the installment type in the form (from the phone / car cards). */
  type?: 'phone' | 'car';
}

export function openRequestDialog(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>(OPEN_EVENT, { detail }));
}

import type { z } from 'zod';
import {
  DELIVERY_DOCUMENTS,
  FINANCING_DOCUMENTS,
  type InstallmentLookupRecord,
  type InstallmentLookupResponseSchema,
  OWNERSHIP_DOCUMENTS,
  type TrackDocument,
  type TrackFinancing,
  type TrackStage,
} from './schemas';

type LookupResponse = z.infer<typeof InstallmentLookupResponseSchema>;

/**
 * Only http(s) URLs reach the browser as links (the values come from admin uploads, but a `javascript:` or
 * `data:` URL must never become a clickable href).
 */
function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Known document keys, in display order; missing / unsafe ones are dropped (no placeholders). */
function pickDocuments(documents: Record<string, string | null | undefined> | null | undefined, keys: readonly string[]): TrackDocument[] {
  if (!documents) return [];
  return keys.flatMap((key) => {
    const url = safeUrl(documents[key]);
    return url ? [{ key, url }] : [];
  });
}

function toStage(block: LookupResponse['delivery'], keys: readonly string[]): TrackStage | null {
  if (!block) return null;
  return { stage: block.stage, stageLabel: block.stage_label ?? null, documents: pickDocuments(block.documents, keys) };
}

function toFinancing(block: LookupResponse['financing']): TrackFinancing | null {
  if (!block) return null;
  const financing: TrackFinancing = {
    carValue: block.car_value,
    transportInsuranceCost: block.transport_insurance_cost,
    shippingDeliveryCost: block.shipping_delivery_cost,
    contractDuration: block.contract_duration,
    totalOffer: block.total_offer,
    documents: pickDocuments(block.documents, FINANCING_DOCUMENTS),
  };
  // "Show the card once any field is non-null" (an all-empty block means the admin hasn't filled anything in yet).
  const hasData =
    financing.documents.length > 0 ||
    [financing.carValue, financing.transportInsuranceCost, financing.shippingDeliveryCost, financing.contractDuration, financing.totalOffer].some(
      (value) => value !== null,
    );
  return hasData ? financing : null;
}

/** Maps the lookup response to the plain record the tracker renders. */
export function toLookupRecord(data: LookupResponse): InstallmentLookupRecord {
  return {
    requestNumber: data.request_number,
    fullName: data.full_name ?? '',
    installmentType: data.installment_type,
    status: data.status,
    submittedAt: data.submitted_at ?? '',
    adminNote: data.admin_note,
    financing: toFinancing(data.financing),
    ownershipTransfer: toStage(data.ownership_transfer, OWNERSHIP_DOCUMENTS),
    delivery: toStage(data.delivery, DELIVERY_DOCUMENTS),
    completedAt: data.completed_at ?? null,
  };
}

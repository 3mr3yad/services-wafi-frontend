import { z } from 'zod';

/** E.164 phone, same regex as PublicOvfleController@store. */
export const E164_PHONE = /^\+[1-9]\d{7,14}$/;

/**
 * Contract: wafi-service app/Http/Controllers/Api/PublicOvfleController.php
 *
 * POST /api/v1/public/ovfle → 201 { data: { request_number, message } }
 *   Body: installment_type (phone|device|car), full_name, email, phone (E.164), national_id, salary, obligations,
 *   employer_type (government|employee|retired), employment_duration (under_3_months|over_3_months),
 *   car_type / car_model / car_value (required only when installment_type = car).
 *   422 → { message, errors: { field: [..] } }.
 *
 * GET /api/v1/public/ovfle/lookup/{value} (request number or phone) → 200 below, 404 { found: false, message }.
 */
export const SUBMIT_PATH = 'ovfle';
export const LOOKUP_PATH = 'ovfle/lookup';

export const InstallmentSubmitResponseSchema = z.object({
  data: z.object({
    request_number: z.string(),
    message: z.string().optional(),
  }),
});

export type InstallmentSubmitResponse = z.infer<typeof InstallmentSubmitResponseSchema>;

/** Amounts arrive as decimal strings ("90000.00"); numbers are accepted too. */
const Amount = z
  .union([z.string(), z.number()])
  .nullish()
  .transform((value) => {
    if (value === null || value === undefined || value === '') return null;
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(number) ? number : null;
  })
  .catch(null);

/** { key: url } — only uploaded keys are present; {} = nothing yet. Vetted later (http/https only). */
const Documents = z.record(z.string(), z.string().nullish()).nullish().catch(null);

const FinancingSchema = z.object({
  car_value: Amount,
  transport_insurance_cost: Amount,
  shipping_delivery_cost: Amount,
  contract_duration: Amount,
  total_offer: Amount,
  documents: Documents,
});

const StageBlockSchema = z.object({
  stage: z.string(),
  stage_label: z.string().nullish(),
  documents: Documents,
});

export const InstallmentLookupResponseSchema = z.object({
  found: z.literal(true),
  request_number: z.string(),
  full_name: z.string().nullable(),
  installment_type: z.string(),
  installment_type_label: z.string().nullish(),
  status: z.string(),
  status_label: z.string().nullish(),
  submitted_at: z.string().nullable(),
  admin_note: z.string().nullable(),
  // Post-offer tracking (PUBLIC_SERVICES_API.md §6). Each block is optional and .catch(null): a malformed
  // new field must never break the whole status lookup.
  financing: FinancingSchema.nullish().catch(null),
  ownership_transfer: StageBlockSchema.nullish().catch(null),
  delivery: StageBlockSchema.nullish().catch(null),
  completed_at: z.string().nullish().catch(null),
});

/** Ordered stages (PUBLIC_SERVICES_API.md §6). Unknown values fall back to the API's stage_label text. */
export const OWNERSHIP_STAGES = ['pending', 'in_progress', 'insurance_pending', 'transferred'] as const;
export const DELIVERY_STAGES = ['pending', 'in_progress', 'shipping', 'delivered'] as const;
export const FINANCING_DOCUMENTS = ['contract', 'bond', 'agreement', 'invoice'] as const;
export const OWNERSHIP_DOCUMENTS = ['fee', 'insurance', 'other'] as const;
export const DELIVERY_DOCUMENTS = ['admin_data', 'shipping_data', 'confirmation', 'other'] as const;

/** A document the customer can open: key is one of the *_DOCUMENTS above, url is a vetted http(s) URL. */
export interface TrackDocument {
  key: string;
  url: string;
}

export interface TrackStage {
  stage: string;
  stageLabel: string | null;
  documents: TrackDocument[];
}

export interface TrackFinancing {
  carValue: number | null;
  transportInsuranceCost: number | null;
  shippingDeliveryCost: number | null;
  /** Months. */
  contractDuration: number | null;
  totalOffer: number | null;
  documents: TrackDocument[];
}

/** What the lookup Server Action hands to the browser. */
export interface InstallmentLookupRecord {
  requestNumber: string;
  fullName: string;
  installmentType: string;
  status: string;
  submittedAt: string;
  adminNote: string | null;
  /** Car only, once the admin fills anything in (null = nothing to show yet). */
  financing: TrackFinancing | null;
  /** Car only. */
  ownershipTransfer: TrackStage | null;
  /** Every type. */
  delivery: TrackStage | null;
  /** YYYY-MM-DD once the whole request is finished. */
  completedAt: string | null;
}

export type InstallmentLookupResult = { status: 'found'; record: InstallmentLookupRecord } | { status: 'not_found' };

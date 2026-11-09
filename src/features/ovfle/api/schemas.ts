import { z } from 'zod';

/** E.164 phone, same regex as PublicOvfleController@store. */
export const E164_PHONE = /^\+[1-9]\d{7,14}$/;

/**
 * Contract: wafi-service app/Http/Controllers/Api/PublicOvfleController.php
 *
 * POST /api/v1/public/ovfle → 201 { data: { request_number, message } }
 *   Body: installment_type (phone|car), full_name, email, phone (E.164), national_id, salary, obligations,
 *   employer_type (government|employee|retired), employment_duration (under_3_months|over_3_months),
 *   car_type / car_model / car_value (required only when installment_type = car).
 *   422 → { message, errors: { field: [..] } }.
 *
 * GET /api/v1/public/ovfle/lookup/{value} (request number or phone) → 200 below, 404 { found: false, message }.
 */
export const OVFLE_SUBMIT_PATH = 'api/v1/public/ovfle';
export const OVFLE_LOOKUP_PATH = 'api/v1/public/ovfle/lookup';

export const OvfleSubmitResponseSchema = z.object({
  data: z.object({
    request_number: z.string(),
    message: z.string().optional(),
  }),
});

export type OvfleSubmitResponse = z.infer<typeof OvfleSubmitResponseSchema>;

export const OvfleLookupResponseSchema = z.object({
  found: z.literal(true),
  request_number: z.string(),
  full_name: z.string().nullable(),
  installment_type: z.string(),
  installment_type_label: z.string().nullish(),
  status: z.string(),
  status_label: z.string().nullish(),
  submitted_at: z.string().nullable(),
  admin_note: z.string().nullable(),
});

/** What the lookup Server Action hands to the browser. */
export interface OvfleLookupRecord {
  fullName: string;
  installmentType: string;
  status: string;
  submittedAt: string;
  adminNote: string | null;
}

export type OvfleLookupResult = { status: 'found'; record: OvfleLookupRecord } | { status: 'not_found' };

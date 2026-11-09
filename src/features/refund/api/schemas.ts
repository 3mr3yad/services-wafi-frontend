import { z } from 'zod';

/** E.164 phone, same regex as RefundController@store ('phone' => 'regex:/^\+[1-9]\d{7,14}$/'). */
export const E164_PHONE = /^\+[1-9]\d{7,14}$/;

/**
 * GET /refund/lookup/{requestNumber} (RefundController@lookup), 200 response.
 * 404 returns { found: false } and surfaces as ApiError('not_found').
 */
export const RefundLookupResponseSchema = z.object({
  found: z.literal(true),
  request_number: z.union([z.string(), z.number()]).nullable(),
  full_name: z.string().nullable(),
  product_name: z.string().nullable(),
  finance_company: z.string().nullable(),
  status: z.string(),
  submitted_at: z.string().nullable(),
  admin_note: z.string().nullable(),
});

export type RefundLookupResponse = z.infer<typeof RefundLookupResponseSchema>;

/** What the lookup Server Action hands to the browser. */
export interface RefundLookupRecord {
  fullName: string;
  productName: string;
  status: string;
  submittedAt: string;
  adminNote: string | null;
}

export type RefundLookupResult = { status: 'found'; record: RefundLookupRecord } | { status: 'not_found' };

// TODO(backend-contract): PROVISIONAL success body of the future /api/v1/public submit endpoint.
// The old controller redirected back with session('success') + session('request_number').
export const RefundSubmitResponseSchema = z.object({
  data: z.object({
    request_number: z.string(),
    message: z.string().optional(),
  }),
});

export type RefundSubmitResponse = z.infer<typeof RefundSubmitResponseSchema>;

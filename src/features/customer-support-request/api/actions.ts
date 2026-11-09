'use server';

import { api } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import { type FormResult, submitForm } from '@/lib/api/form-submit';
import {
  E164_REGEX,
  type LookupResult,
  LookupResponseSchema,
  type RateInput,
  RateInputSchema,
  RateResponseSchema,
  type SubmitResponse,
  SubmitResponseSchema,
} from './schemas';

// TODO(backend-contract): JSON submission endpoint (being built under /api/v1/public/*).
// Fields (multipart, names as in the old Blade form): customer_name, customer_phone (E.164),
// issue_type, order_number, issue_description, attachments[] (0..10 files).
const SUBMIT_PATH: string | null = null;

// TODO(backend-contract): the old POST /customer-support-request/rate is a web route behind CSRF,
// so it can't be called server-to-server. Set once a JSON (CSRF-free) rate endpoint exists.
const RATE_PATH: string | null = null;

const LOOKUP_PATH = '/customer-support-request/lookup';

/** Submits a new support ticket. Returns not_configured until the backend contract exists. */
export async function submitSupportRequest(formData: FormData): Promise<FormResult<SubmitResponse>> {
  if (!SUBMIT_PATH) return { status: 'error', kind: 'not_configured' };
  return submitForm(SUBMIT_PATH, formData, SubmitResponseSchema);
}

export type LookupOutcome = { ok: true; result: LookupResult } | { ok: false };

/** Latest ticket for a phone number. Same as the old page: any failure is shown as "not found". */
export async function lookupSupportRequest(phone: string): Promise<LookupOutcome> {
  const value = phone.trim();
  if (!E164_REGEX.test(value)) return { ok: false };

  try {
    const result = await api.get(LOOKUP_PATH, { query: { phone: value }, schema: LookupResponseSchema, cache: 'no-store' });
    return { ok: true, result };
  } catch (error) {
    if (isApiError(error)) {
      if (error.kind !== 'not_found') console.error(`[support-lookup] ${error.kind}: ${error.message}`);
    } else {
      console.error('[support-lookup] unexpected error', error);
    }
    return { ok: false };
  }
}

export type RateOutcome = { status: 'success'; rating: number } | { status: 'not_configured' } | { status: 'error' };

/** CSAT rating (1..5) for the ticket found by lookup. The phone must match the ticket's phone. */
export async function rateSupportRequest(input: RateInput): Promise<RateOutcome> {
  const parsed = RateInputSchema.safeParse(input);
  if (!parsed.success) return { status: 'error' };
  if (!RATE_PATH) return { status: 'not_configured' };

  try {
    const data = await api.post(RATE_PATH, { body: parsed.data, schema: RateResponseSchema, cache: 'no-store' });
    return { status: 'success', rating: data.rating };
  } catch (error) {
    if (isApiError(error)) console.error(`[support-rate] ${error.kind}: ${error.message}`);
    else console.error('[support-rate] unexpected error', error);
    return { status: 'error' };
  }
}

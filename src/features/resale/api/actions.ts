'use server';

import { api } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import { type FormResult, submitForm } from '@/lib/api/form-submit';
import {
  type DecidePriceInput,
  DecidePriceInputSchema,
  DecidePriceResponseSchema,
  type ResaleLookup,
  ResaleLookupSchema,
  type ResaleSubmitSuccess,
  ResaleSubmitSuccessSchema,
} from './schemas';

// ---------------------------------------------------------------------------------------------
// Submit the trade-in form. Field names are exactly the old Blade form's:
// customer_name, customer_phone (E.164), brand, model, answers[<question id>], device_images[screen|back|
// right_edge|left_edge|top|bottom|battery].
// TODO(backend-contract): no JSON submission endpoint yet (old POST /resale is a CSRF web route).
// ---------------------------------------------------------------------------------------------
const SUBMIT_PATH: string | null = 'resale'; // POST /resale (multipart)

export async function submitResale(formData: FormData): Promise<FormResult<ResaleSubmitSuccess['data']>> {
  if (!SUBMIT_PATH) return { status: 'error', kind: 'not_configured' };
  const result = await submitForm(SUBMIT_PATH, formData, ResaleSubmitSuccessSchema);
  return result.status === 'success' ? { status: 'success', data: result.data.data } : result;
}

// ---------------------------------------------------------------------------------------------
// GET /resale/lookup/{requestNumber}: live JSON endpoint (accepts a request number or a phone number).
// ---------------------------------------------------------------------------------------------
export type ResaleLookupOutcome = { found: true; result: ResaleLookup } | { found: false };

export async function lookupResale(value: string): Promise<ResaleLookupOutcome> {
  const query = value.trim().slice(0, 64);
  if (!query) return { found: false };
  try {
    const result = await api.get(`/resale/lookup/${encodeURIComponent(query)}`, { schema: ResaleLookupSchema, cache: 'no-store' });
    return { found: true, result };
  } catch (error) {
    if (isApiError(error)) {
      if (error.kind !== 'not_found') console.error(`[resale-lookup] ${error.kind}: ${error.message}`);
    } else {
      console.error('[resale-lookup] unexpected error', error);
    }
    // Same as the old page: any failure shows "not found".
    return { found: false };
  }
}

// ---------------------------------------------------------------------------------------------
// Customer price decision. Old POST /resale/decide-price is a web route behind CSRF + session, so it cannot be
// called server-to-server. TODO(backend-contract): set once a stateless JSON endpoint exists.
// ---------------------------------------------------------------------------------------------
const DECIDE_PRICE_PATH: string | null = 'resale/decide-price'; // POST JSON {phone, request_number, price_type, decision}

export type DecidePriceOutcome = { status: 'success' } | { status: 'error'; kind: 'not_configured' | 'failed' };

export async function decideResalePrice(input: DecidePriceInput): Promise<DecidePriceOutcome> {
  const parsed = DecidePriceInputSchema.safeParse(input);
  if (!parsed.success) return { status: 'error', kind: 'failed' };
  if (!DECIDE_PRICE_PATH) return { status: 'error', kind: 'not_configured' };
  try {
    await api.post(DECIDE_PRICE_PATH, { body: parsed.data, schema: DecidePriceResponseSchema, cache: 'no-store' });
    return { status: 'success' };
  } catch (error) {
    if (isApiError(error)) console.error(`[resale-decide-price] ${error.kind}: ${error.message}`);
    else console.error('[resale-decide-price] unexpected error', error);
    return { status: 'error', kind: 'failed' };
  }
}

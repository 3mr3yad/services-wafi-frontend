'use server';

import { api } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import { type FormResult, submitForm } from '@/lib/api/form-submit';
import {
  E164_PHONE,
  type XleaderLookupResult,
  XleaderLookupResponseSchema,
  type XleaderSubmitResponse,
  XleaderSubmitResponseSchema,
} from './schemas';

/**
 * Old route: POST /xleader (XleaderController@store), multipart. Field names kept 1:1 with the Blade form:
 * customer_name, customer_phone (E.164), brand (xleader_brands.id), model, imei (15 digits), terms_accepted (=1),
 * device_images[screen|back|right_edge|left_edge|top|bottom|battery] (battery = purchase invoice photo).
 */
const SUBMIT_PATH: string | null = 'xleader'; // POST /xleader (multipart)

export async function submitXleaderRequest(formData: FormData): Promise<FormResult<XleaderSubmitResponse>> {
  if (SUBMIT_PATH === null) {
    return { status: 'error', kind: 'not_configured' };
  }
  return submitForm(SUBMIT_PATH, formData, XleaderSubmitResponseSchema);
}

/** GET /xleader/lookup/{requestNumber}: the visitor types a phone; the backend matches request_number or phone. */
export async function lookupXleaderWarranty(phone: string): Promise<XleaderLookupResult> {
  if (typeof phone !== 'string' || !E164_PHONE.test(phone)) return { status: 'not_found' };

  try {
    const data = await api.get(`xleader/lookup/${encodeURIComponent(phone)}`, {
      schema: XleaderLookupResponseSchema,
      cache: 'no-store',
    });
    return {
      status: 'found',
      record: {
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        brand: data.brand ?? null,
        model: data.model ?? null,
        warrantyStart: data.warranty_start,
        warrantyEnd: data.warranty_end,
      },
    };
  } catch (error) {
    // The old page showed "not found" for every failure (404, network, throttling...).
    if (!isApiError(error) || error.kind !== 'not_found') {
      console.error('[xleader lookup]', isApiError(error) ? `${error.kind}: ${error.message}` : error);
    }
    return { status: 'not_found' };
  }
}

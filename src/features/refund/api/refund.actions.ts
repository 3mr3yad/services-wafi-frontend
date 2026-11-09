'use server';

import { api } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import { type FormResult, submitForm } from '@/lib/api/form-submit';
import { E164_PHONE, type RefundLookupResult, RefundLookupResponseSchema, type RefundSubmitResponse, RefundSubmitResponseSchema } from './schemas';

/**
 * Old route: POST /submit-request (RefundController@store), multipart.
 * Field names (kept 1:1 with the Blade form): full_name, national_id, phone (E.164), finance_company,
 * finance_amount, finance_duration, product_name, attachment.
 */
const SUBMIT_PATH: string | null = 'refund'; // POST /refund (multipart)

export async function submitRefundRequest(formData: FormData): Promise<FormResult<RefundSubmitResponse>> {
  if (SUBMIT_PATH === null) {
    return { status: 'error', kind: 'not_configured' };
  }
  return submitForm(SUBMIT_PATH, formData, RefundSubmitResponseSchema);
}

/** GET /refund/lookup/{requestNumber}: the visitor types a phone; the backend matches request_number or phone. */
export async function lookupRefundRequest(phone: string): Promise<RefundLookupResult> {
  if (typeof phone !== 'string' || !E164_PHONE.test(phone)) return { status: 'not_found' };

  try {
    const data = await api.get(`refund/lookup/${encodeURIComponent(phone)}`, {
      schema: RefundLookupResponseSchema,
      cache: 'no-store',
    });
    return {
      status: 'found',
      record: {
        fullName: data.full_name ?? '',
        productName: data.product_name ?? '',
        status: data.status,
        submittedAt: data.submitted_at ?? '',
        adminNote: data.admin_note,
      },
    };
  } catch (error) {
    // The old page showed "not found" for every failure (404, network, throttling...).
    if (!isApiError(error) || error.kind !== 'not_found') {
      console.error('[refund lookup]', isApiError(error) ? `${error.kind}: ${error.message}` : error);
    }
    return { status: 'not_found' };
  }
}

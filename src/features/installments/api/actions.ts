'use server';

import { api } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import { type FormResult, submitForm } from '@/lib/api/form-submit';
import {
  E164_PHONE,
  LOOKUP_PATH,
  SUBMIT_PATH,
  type InstallmentLookupResult,
  InstallmentLookupResponseSchema,
  type InstallmentSubmitResponse,
  InstallmentSubmitResponseSchema,
} from './schemas';
import { toLookupRecord } from './lookup-record';

/** Submits the installment request to POST /api/v1/public/ovfle (field names = the old Blade form). */
export async function submitInstallmentRequest(formData: FormData): Promise<FormResult<InstallmentSubmitResponse>> {
  // Same as the old page: car fields are only sent for car installments.
  if (formData.get('installment_type') !== 'car') {
    formData.delete('car_type');
    formData.delete('car_model');
    formData.delete('car_value');
  }
  return submitForm(SUBMIT_PATH, formData, InstallmentSubmitResponseSchema);
}

/** GET /api/v1/public/ovfle/lookup/{phone}: matches request number or phone. */
export async function lookupInstallmentRequest(phone: string): Promise<InstallmentLookupResult> {
  if (typeof phone !== 'string' || !E164_PHONE.test(phone)) return { status: 'not_found' };

  try {
    const data = await api.get(`${LOOKUP_PATH}/${encodeURIComponent(phone)}`, {
      schema: InstallmentLookupResponseSchema,
      cache: 'no-store',
    });
    return { status: 'found', record: toLookupRecord(data) };
  } catch (error) {
    // Like the old page: every failure shows "not found".
    if (!isApiError(error) || error.kind !== 'not_found') {
      console.error('[installments lookup]', isApiError(error) ? `${error.kind}: ${error.message}` : error);
    }
    return { status: 'not_found' };
  }
}

'use server';

import { api } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import { type FormResult, submitForm } from '@/lib/api/form-submit';
import {
  E164_PHONE,
  OVFLE_LOOKUP_PATH,
  OVFLE_SUBMIT_PATH,
  type OvfleLookupResult,
  OvfleLookupResponseSchema,
  type OvfleSubmitResponse,
  OvfleSubmitResponseSchema,
} from './schemas';

/** Submits the installment request to POST /api/v1/public/ovfle (field names = the old Blade form). */
export async function submitOvfleRequest(formData: FormData): Promise<FormResult<OvfleSubmitResponse>> {
  // Same as the old page: car fields are only sent for car installments.
  if (formData.get('installment_type') !== 'car') {
    formData.delete('car_type');
    formData.delete('car_model');
    formData.delete('car_value');
  }
  return submitForm(OVFLE_SUBMIT_PATH, formData, OvfleSubmitResponseSchema);
}

/** GET /api/v1/public/ovfle/lookup/{phone}: matches request number or phone. */
export async function lookupOvfleRequest(phone: string): Promise<OvfleLookupResult> {
  if (typeof phone !== 'string' || !E164_PHONE.test(phone)) return { status: 'not_found' };

  try {
    const data = await api.get(`${OVFLE_LOOKUP_PATH}/${encodeURIComponent(phone)}`, {
      schema: OvfleLookupResponseSchema,
      cache: 'no-store',
    });
    return {
      status: 'found',
      record: {
        fullName: data.full_name ?? '',
        installmentType: data.installment_type,
        status: data.status,
        submittedAt: data.submitted_at ?? '',
        adminNote: data.admin_note,
      },
    };
  } catch (error) {
    // Like the old page: every failure shows "not found".
    if (!isApiError(error) || error.kind !== 'not_found') {
      console.error('[ovfle lookup]', isApiError(error) ? `${error.kind}: ${error.message}` : error);
    }
    return { status: 'not_found' };
  }
}

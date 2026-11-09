'use server';

import { type FormResult, submitForm } from '@/lib/api/form-submit';
import { type SubmitResponse, SubmitResponseSchema } from './schemas';

// TODO(backend-contract): JSON submission endpoint (being built under /api/v1/public/*).
// Fields (multipart, names as in the old Blade form): full_name, phone (E.164), city, district,
// national_address, winning_platform, draw_presenter, draw_date (YYYY-MM-DD), prize_type, winning_image (file).
const SUBMIT_PATH: string | null = null;

/** Submits a follower-gift (winner details) request. Returns not_configured until the backend contract exists. */
export async function submitFollowerGift(formData: FormData): Promise<FormResult<SubmitResponse>> {
  if (!SUBMIT_PATH) return { status: 'error', kind: 'not_configured' };
  return submitForm(SUBMIT_PATH, formData, SubmitResponseSchema);
}

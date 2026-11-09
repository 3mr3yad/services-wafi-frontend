import 'server-only';
import { api } from '@/lib/api/client';
import { ApiError } from '@/lib/api/errors';
import { isMockMode } from '@/lib/config/env';
import { getResaleFormDataMock } from '../mocks/form-data.mock';
import { type ResaleFormData, ResaleFormDataSchema } from './schemas';

/**
 * Render-time data for the trade-in form (old ResaleController@index: active brands + active questions).
 * TODO(backend-contract): the backend has no JSON endpoint for this yet. Expected: GET returning
 *   { data: { brands: [{ id, name }], questions: [{ id, question, answers: [{ id, answer }] }] } }
 */
const FORM_DATA_PATH: string | null = null;

export async function getResaleFormData(): Promise<{ data: ResaleFormData; isMock: boolean }> {
  if (FORM_DATA_PATH) {
    const response = await api.get(FORM_DATA_PATH, { schema: ResaleFormDataSchema, next: { revalidate: 300 } });
    return { data: response.data, isMock: false };
  }
  if (isMockMode()) {
    // Mocks go through the same schema as real responses, so they cannot drift from the contract.
    return { data: ResaleFormDataSchema.parse(getResaleFormDataMock()).data, isMock: true };
  }
  throw new ApiError('not_configured', 'Resale form data endpoint (brands + questions) is not defined yet.');
}

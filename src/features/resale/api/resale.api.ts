import 'server-only';
import { z } from 'zod';
import { api } from '@/lib/api/client';
import { ApiError, isApiError } from '@/lib/api/errors';
import { isMockMode } from '@/lib/config/env';
import { getResaleFormDataMock } from '../mocks/form-data.mock';
import { type ResaleFormData, ResaleBrandSchema, ResaleFormDataSchema, ResaleQuestionSchema } from './schemas';

/**
 * Render-time data for the trade-in form, from the public API:
 *   GET /resale/brands    → { data: [{ id, name }] }
 *   GET /resale/questions → { data: [{ id, question, answers: [{ id, answer }] }] }
 * Cached for 5 minutes. In local development (API_MOCKS=true) a labelled mock is used if the API isn't reachable.
 */
const BrandsResponse = z.object({ data: z.array(ResaleBrandSchema) });
const QuestionsResponse = z.object({ data: z.array(ResaleQuestionSchema) });

export async function getResaleFormData(): Promise<{ data: ResaleFormData; isMock: boolean }> {
  try {
    const [brands, questions] = await Promise.all([
      api.get('resale/brands', { schema: BrandsResponse, next: { revalidate: 300 } }),
      api.get('resale/questions', { schema: QuestionsResponse, next: { revalidate: 300 } }),
    ]);
    return { data: { brands: brands.data, questions: questions.data }, isMock: false };
  } catch (error) {
    if (isMockMode()) {
      // Mocks go through the same schema as real responses, so they cannot drift from the contract.
      return { data: ResaleFormDataSchema.parse(getResaleFormDataMock()).data, isMock: true };
    }
    if (isApiError(error)) throw error;
    throw new ApiError('network', 'Could not load resale form data.', { cause: error });
  }
}

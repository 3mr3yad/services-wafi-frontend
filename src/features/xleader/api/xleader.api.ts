import 'server-only';
import { z } from 'zod';
import { api } from '@/lib/api/client';
import { ApiError, isApiError } from '@/lib/api/errors';
import { isMockMode } from '@/lib/config/env';
import { getXleaderBrandsMock } from '../mocks/brands.mock';
import { type XleaderBrand, XleaderBrandListSchema, XleaderBrandSchema } from './schemas';

/** Active brands for the select: GET /xleader/brands → { data: [{ id, name }] }. Cached for 5 minutes. */
const BrandsResponse = z.object({ data: z.array(XleaderBrandSchema) });

export async function getXleaderBrands(): Promise<XleaderBrand[]> {
  try {
    const response = await api.get('xleader/brands', { schema: BrandsResponse, next: { revalidate: 300 } });
    return response.data;
  } catch (error) {
    if (isMockMode()) return XleaderBrandListSchema.parse(getXleaderBrandsMock());
    if (isApiError(error)) throw error;
    throw new ApiError('network', 'Could not load xleader brands.', { cause: error });
  }
}

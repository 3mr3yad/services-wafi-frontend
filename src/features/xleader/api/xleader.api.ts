import 'server-only';
import { api } from '@/lib/api/client';
import { ApiError } from '@/lib/api/errors';
import { isMockMode } from '@/lib/config/env';
import { getXleaderBrandsMock } from '../mocks/brands.mock';
import { type XleaderBrand, XleaderBrandListSchema } from './schemas';

/**
 * Active brands for the select (old XleaderController@index: is_active = 1, order by sort_order, name).
 * Expected JSON: [{ "id": 1, "name": "Apple" }, ...] (or wrapped, adjust the schema when the contract lands).
 */
const BRANDS_PATH: string | null = null; // TODO(backend-contract)

export async function getXleaderBrands(): Promise<XleaderBrand[]> {
  if (BRANDS_PATH !== null) {
    return api.get(BRANDS_PATH, { schema: XleaderBrandListSchema, next: { revalidate: 300 } });
  }
  if (isMockMode()) {
    return XleaderBrandListSchema.parse(getXleaderBrandsMock());
  }
  throw new ApiError('not_configured', 'Xleader brands endpoint is not defined yet.');
}

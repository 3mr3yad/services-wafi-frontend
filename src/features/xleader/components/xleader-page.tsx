import { isApiError } from '@/lib/api/errors';
import type { XleaderBrand } from '../api/schemas';
import { getXleaderBrands } from '../api/xleader.api';
import { XleaderPortal } from './xleader-portal';

/** Server entry: loads the render-time data (active brands, old XleaderController@index) and renders the page. */
export async function XleaderPage() {
  let brands: XleaderBrand[] = [];
  let brandsUnavailable = false;
  try {
    brands = await getXleaderBrands();
  } catch (error) {
    if (!isApiError(error)) throw error;
    if (error.kind !== 'not_configured') console.error(`[xleader brands] ${error.kind}: ${error.message}`);
    brandsUnavailable = true;
  }
  return <XleaderPortal brands={brands} brandsUnavailable={brandsUnavailable} />;
}

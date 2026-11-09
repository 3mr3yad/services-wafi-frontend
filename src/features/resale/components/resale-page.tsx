import 'server-only';
import { isApiError } from '@/lib/api/errors';
import { getResaleFormData } from '../api/resale.api';
import type { ResaleFormData } from '../api/schemas';
import { ResaleView } from './resale-view';

/** Server entry: loads brands + questions (old ResaleController@index), then renders the client page. */
export async function ResalePage() {
  let data: ResaleFormData | null = null;
  let isMock = false;
  try {
    const result = await getResaleFormData();
    data = result.data;
    isMock = result.isMock;
  } catch (error) {
    // The lookup box still works; the form area shows a "not available" notice.
    if (isApiError(error)) console.error(`[resale] form data ${error.kind}: ${error.message}`);
    else throw error;
  }
  return <ResaleView data={data} isMock={isMock} />;
}

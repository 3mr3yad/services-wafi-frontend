import { z } from 'zod';

/** Same regex the old XleaderController@store applies to customer_phone (E.164). */
export const E164_PHONE = /^\+[1-9]\d{7,14}$/;

/**
 * One active brand for the "choose the brand" select (xleader_brands: id, name, is_active, sort_order).
 * XleaderController@index passes active brands ordered by sort_order, then name.
 * PROVISIONAL: there is no JSON endpoint for this yet.
 */
export const XleaderBrandSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});
export const XleaderBrandListSchema = z.array(XleaderBrandSchema);
export type XleaderBrand = z.infer<typeof XleaderBrandSchema>;

/** GET /xleader/lookup/{requestNumber} (XleaderController@lookup). 404 → {found:false}. */
export const XleaderLookupResponseSchema = z.object({
  found: z.literal(true),
  request_number: z.union([z.string(), z.number()]).nullable().optional(),
  customer_name: z.string(),
  customer_phone: z.string(),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  warranty_start: z.string(),
  warranty_end: z.string(),
});

export interface XleaderLookupRecord {
  customerName: string;
  customerPhone: string;
  brand: string | null;
  model: string | null;
  warrantyStart: string;
  warrantyEnd: string;
}

export type XleaderLookupResult = { status: 'found'; record: XleaderLookupRecord } | { status: 'not_found' };

/**
 * PROVISIONAL success response of the future submission endpoint. TODO(backend-contract).
 * warranty_start / warranty_end (Y-m-d) replace the old session flashes of the same name
 * (created_at and created_at + 1 year) used for the request-number modal hint.
 */
export const XleaderSubmitResponseSchema = z.object({
  data: z.object({
    request_number: z.string(),
    message: z.string().optional(),
    warranty_start: z.string().optional(),
    warranty_end: z.string().optional(),
  }),
});
export type XleaderSubmitResponse = z.infer<typeof XleaderSubmitResponseSchema>;

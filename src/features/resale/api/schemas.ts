import { z } from 'zod';

/**
 * Resale (device trade-in) contracts.
 * Shapes follow wafi-service: ResaleController, models ResaleBrand / ResaleQuestion / ResaleQuestionAnswer / ResaleRequest
 * and their migrations.
 */

// ---------------------------------------------------------------------------------------------
// Render-time data (old ResaleController@index passed $brands and $questions to the view).
// TODO(backend-contract): no JSON endpoint exists yet; this is the PROVISIONAL shape.
// ---------------------------------------------------------------------------------------------

/** resale_brands row (active only, ordered by sort_order, name). */
export const ResaleBrandSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

/** resale_question_answers row (active only, ordered by sort_order). Not rendered by the old page, kept for parity. */
export const ResaleQuestionAnswerSchema = z.object({
  id: z.number().int(),
  answer: z.string(),
});

/** resale_questions row (active only, ordered by sort_order, question) with its active answers. */
export const ResaleQuestionSchema = z.object({
  id: z.number().int(),
  question: z.string(),
  answers: z.array(ResaleQuestionAnswerSchema).default([]),
});

export const ResaleFormDataSchema = z.object({
  data: z.object({
    brands: z.array(ResaleBrandSchema),
    questions: z.array(ResaleQuestionSchema),
  }),
});

export type ResaleBrand = z.infer<typeof ResaleBrandSchema>;
export type ResaleQuestion = z.infer<typeof ResaleQuestionSchema>;
export type ResaleFormData = z.infer<typeof ResaleFormDataSchema>['data'];

// ---------------------------------------------------------------------------------------------
// GET /resale/lookup/{requestNumber} (live today). 404 => { found: false }.
// ---------------------------------------------------------------------------------------------

/** decimal:2 casts arrive as strings ("1500.00"); accept numbers too. */
const Price = z.union([z.string(), z.number()]).nullable();

export const ResaleLookupSchema = z.object({
  found: z.literal(true),
  request_number: z
    .union([z.string(), z.number()])
    .nullable()
    .transform((value) => (value === null ? '' : String(value))),
  customer_name: z.string().nullable(),
  customer_phone: z.string().nullable(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  status: z.string().nullable(),
  submitted_at: z.string().nullable(),
  stage: z.string().nullable(),
  stage_label: z.string().nullable(),
  closed: z.boolean(),
  closed_reason_label: z.string().nullable(),
  awaiting_initial_decision: z.boolean(),
  initial_price: Price,
  awaiting_final_decision: z.boolean(),
  final_price: Price,
  discount_code: z.string().nullable(),
  transfer_receipt_url: z.string().nullable(),
});

export type ResaleLookup = z.infer<typeof ResaleLookupSchema>;

/** GET /resale/questions/{resaleQuestion}/answers (live today; the old public page never calls it). */
export const ResaleAnswersResponseSchema = z.object({
  data: z.array(ResaleQuestionAnswerSchema),
});

// ---------------------------------------------------------------------------------------------
// POST /resale/decide-price — today a CSRF-protected web route, so it can't be called server-to-server.
// Body: { phone, request_number, price_type: 'initial'|'final', decision: 'approve'|'reject' }.
// ---------------------------------------------------------------------------------------------

export const DecidePriceInputSchema = z.object({
  phone: z.string().min(1).max(32),
  request_number: z.string().min(1).max(64),
  price_type: z.enum(['initial', 'final']),
  decision: z.enum(['approve', 'reject']),
});

export type DecidePriceInput = z.infer<typeof DecidePriceInputSchema>;

/** Old controller response on success: { found: true, stage }. */
export const DecidePriceResponseSchema = z.object({
  found: z.literal(true),
  stage: z.string().nullable().optional(),
});

// ---------------------------------------------------------------------------------------------
// Form submission (old POST /resale, web route). TODO(backend-contract): PROVISIONAL success shape.
// ---------------------------------------------------------------------------------------------

export const ResaleSubmitSuccessSchema = z.object({
  data: z.object({
    request_number: z.union([z.string(), z.number()]).transform(String),
    message: z.string().optional(),
  }),
});

export type ResaleSubmitSuccess = z.infer<typeof ResaleSubmitSuccessSchema>;

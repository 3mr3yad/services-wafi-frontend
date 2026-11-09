import { z } from 'zod';
import { E164_REGEX } from '../constants';

export { E164_REGEX, GENERAL_INQUIRY, ISSUE_TYPES, type IssueType, SHIPPING } from '../constants';

const RequestNumber = z.union([z.string(), z.number()]).transform(String);

/**
 * Contract of GET /customer-support-request/lookup?phone=+E164
 * (wafi-service CustomerSupportRequestController::lookup). 404 {found:false} when nothing matches.
 */
export const LookupResponseSchema = z.object({
  found: z.literal(true),
  request_number: RequestNumber,
  customer_name: z.string().nullish(),
  issue_type: z.string().nullish(),
  status: z.object({ name: z.string(), color: z.string().nullish() }).nullish(),
  department: z.object({ name: z.string(), color: z.string().nullish() }).nullish(),
  action_taken: z.string().nullish(),
  attachments: z.array(z.object({ url: z.string(), original_filename: z.string().nullish() })).default([]),
  created_at: z.string().nullish(),
  rating: z.number().int().nullish(),
  closed: z.boolean().default(false),
});

export type LookupResult = z.infer<typeof LookupResponseSchema>;

/**
 * Contract of POST /customer-support-request/rate (CustomerSupportRequestController::rate):
 * body {phone, request_number, rating 1..5} → {found: true, rating}.
 */
export const RateResponseSchema = z.object({
  found: z.literal(true),
  rating: z.number().int(),
});

export const RateInputSchema = z.object({
  phone: z.string().regex(E164_REGEX),
  request_number: z.string().min(1).max(64),
  rating: z.number().int().min(1).max(5),
});

export type RateInput = z.infer<typeof RateInputSchema>;

// PROVISIONAL (TODO(backend-contract)): success body of the future JSON submission endpoint.
export const SubmitResponseSchema = z.object({
  data: z.object({
    request_number: RequestNumber,
    message: z.string().optional(),
  }),
});

export type SubmitResponse = z.infer<typeof SubmitResponseSchema>;

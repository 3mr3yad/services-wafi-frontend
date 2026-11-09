import { z } from 'zod';

/**
 * Contract of GET /track-request (wafi-service TrackRequestController::search).
 * Verified against the Laravel source: one item per matching refund, resale,
 * xleader or customer-support request. Optional fields are lenient on purpose.
 */
export const TrackResultSchema = z.object({
  service: z.string(),
  service_label: z.string().nullish(),
  request_number: z.string().nullish(),
  customer_name: z.string().nullish(),
  customer_phone: z.string().nullish(),
  status_label: z.string().nullish(),
  status_color: z.string().nullish(),
  details: z.array(z.object({ label: z.string().nullish(), value: z.union([z.string(), z.number()]).nullish() })).default([]),
  attachments: z.array(z.object({ url: z.string(), original_filename: z.string().nullish() })).default([]),
  created_at: z.string().nullish(),
});

export const TrackResponseSchema = z.object({
  results: z.array(TrackResultSchema).default([]),
});

export type TrackResult = z.infer<typeof TrackResultSchema>;

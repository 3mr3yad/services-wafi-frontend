import { z } from 'zod';

// PROVISIONAL (TODO(backend-contract)): success body of the future JSON submission endpoint.
export const SubmitResponseSchema = z.object({
  data: z.object({
    request_number: z.union([z.string(), z.number()]).transform(String),
    message: z.string().optional(),
  }),
});

export type SubmitResponse = z.infer<typeof SubmitResponseSchema>;

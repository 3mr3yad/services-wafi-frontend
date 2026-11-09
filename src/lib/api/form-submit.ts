import 'server-only';
import { z } from 'zod';
import { api } from './client';
import { type ApiErrorKind, isApiError } from './errors';

/**
 * Result of submitting a form to the backend, safe to return from a Server Action to the browser.
 * - success: the backend accepted it (data is the validated response)
 * - invalid: Laravel validation failed (422) — field errors keyed like "device_images.screen"
 * - error:   anything else (network, timeout, not configured...)
 */
export type FormResult<T> =
  | { status: 'success'; data: T }
  | { status: 'invalid'; message: string; errors: Record<string, string[]> }
  | { status: 'error'; kind: ApiErrorKind; message?: string };

const LaravelValidationSchema = z.object({
  message: z.string().default(''),
  errors: z.record(z.string(), z.array(z.string())).default({}),
});

const MessageSchema = z.object({ message: z.string() });

/** POSTs a FormData (files included) to the backend and maps the outcome to a FormResult. */
export async function submitForm<S extends z.ZodType>(path: string, formData: FormData, schema: S): Promise<FormResult<z.infer<S>>> {
  try {
    const data = await api.post(path, { body: formData, schema, cache: 'no-store' });
    return { status: 'success', data };
  } catch (error) {
    if (isApiError(error)) {
      if (error.kind === 'validation') {
        const parsed = LaravelValidationSchema.safeParse(error.details);
        if (parsed.success) return { status: 'invalid', message: parsed.data.message, errors: parsed.data.errors };
      }
      console.error(`[submitForm] ${path} ${error.kind}: ${error.message}`);
      const parsedMessage = MessageSchema.safeParse(error.details);
      return { status: 'error', kind: error.kind, message: parsedMessage.success ? parsedMessage.data.message : undefined };
    }
    console.error(`[submitForm] ${path} unexpected error`, error);
    return { status: 'error', kind: 'network' };
  }
}

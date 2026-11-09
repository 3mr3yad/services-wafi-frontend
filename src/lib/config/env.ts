import 'server-only';
import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_BASE_URL: z.union([z.literal(''), z.url()]).default(''),
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  API_MOCKS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  /** Optional shared secret sent as X-Frontend-Key, so the backend can trust X-Client-IP. Secret: never commit it. */
  FRONTEND_API_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Server-only environment, validated once. Throws a readable error listing every invalid variable.
 */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid server environment variables:\n${issues}`);
  }

  cached = parsed.data;
  return cached;
}

/**
 * Mock data is served only in development. In any other environment the flag is ignored,
 * so mocks can never reach real users.
 */
export function isMockMode(): boolean {
  const env = getServerEnv();
  return env.API_MOCKS && env.NODE_ENV === 'development';
}

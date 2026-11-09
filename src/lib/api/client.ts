import 'server-only';
import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import type { z } from 'zod';
import { getServerEnv } from '@/lib/config/env';
import { ApiError, kindFromStatus } from './errors';

type QueryValue = string | number | boolean | null | undefined;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions<TSchema extends z.ZodType> {
  /** Zod schema the response body must match. Responses are never trusted unchecked. */
  schema: TSchema;
  query?: Record<string, QueryValue>;
  /** JSON-serializable body, or FormData for uploads. */
  body?: unknown;
  headers?: HeadersInit;
  timeoutMs?: number;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
}

async function getClientIp(): Promise<string | null> {
  try {
    const incoming = await headers();
    return incoming.get('cf-connecting-ip') ?? incoming.get('x-forwarded-for')?.split(',')[0]?.trim() ?? incoming.get('x-real-ip');
  } catch {
    return null; // Not inside a request (e.g. build time).
  }
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, QueryValue>): URL {
  const url = new URL(path.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url;
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<TSchema extends z.ZodType>(
  method: HttpMethod,
  path: string,
  options: RequestOptions<TSchema>,
): Promise<z.infer<TSchema>> {
  const env = getServerEnv();
  if (!env.API_BASE_URL) {
    throw new ApiError('not_configured', `API_BASE_URL is not set (requested ${method} ${path}).`);
  }

  const url = buildUrl(env.API_BASE_URL, path, options.query);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  headers.set('Accept-Language', await getLocale());
  if (options.body !== undefined && !isFormData) headers.set('Content-Type', 'application/json');
  // Every call comes from this server, so forward the visitor's IP for per-client rate limiting.
  // The backend should only trust it together with a valid X-Frontend-Key.
  const clientIp = await getClientIp();
  if (clientIp) headers.set('X-Client-IP', clientIp);
  if (env.FRONTEND_API_KEY) headers.set('X-Frontend-Key', env.FRONTEND_API_KEY);
  // Auth: the session's credential is attached here once the backend auth contract is defined.

  const timeout = AbortSignal.timeout(options.timeoutMs ?? env.API_TIMEOUT_MS);
  const signal = options.signal ? AbortSignal.any([timeout, options.signal]) : timeout;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      signal,
      body: options.body === undefined ? undefined : isFormData ? (options.body as FormData) : JSON.stringify(options.body),
      cache: options.cache,
      next: options.next,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('timeout', `Request timed out: ${method} ${url.pathname}`, { cause: error });
    }
    throw new ApiError('network', `Network error: ${method} ${url.pathname}`, { cause: error });
  }

  const body = await readBody(response);

  if (!response.ok) {
    throw new ApiError(kindFromStatus(response.status), `Request failed with ${response.status}: ${method} ${url.pathname}`, {
      status: response.status,
      details: body,
    });
  }

  const parsed = options.schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError('invalid_response', `Response did not match the expected contract: ${method} ${url.pathname}`, {
      status: response.status,
      details: parsed.error.issues,
    });
  }
  return parsed.data;
}

/** Centralized backend client. Server-only: call it from Server Components, Server Actions or route handlers. */
export const api = {
  get: <S extends z.ZodType>(path: string, options: RequestOptions<S>) => request('GET', path, options),
  post: <S extends z.ZodType>(path: string, options: RequestOptions<S>) => request('POST', path, options),
  put: <S extends z.ZodType>(path: string, options: RequestOptions<S>) => request('PUT', path, options),
  patch: <S extends z.ZodType>(path: string, options: RequestOptions<S>) => request('PATCH', path, options),
  delete: <S extends z.ZodType>(path: string, options: RequestOptions<S>) => request('DELETE', path, options),
};

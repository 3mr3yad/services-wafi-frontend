'use server';

import { api } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import { type TrackResult, TrackResponseSchema } from './schemas';

export type TrackRequestOutcome = { ok: true; results: TrackResult[] } | { ok: false; results: [] };

/**
 * Unified tracker: searches every service by phone number or request number.
 * Runs on the server, so the browser never talks to the backend directly.
 * Same behaviour as the old page: any failure is shown as "no results".
 */
export async function trackRequest(query: string): Promise<TrackRequestOutcome> {
  const value = query.trim().slice(0, 64);
  if (!value) return { ok: true, results: [] };

  try {
    const data = await api.get('/track-request', {
      query: { query: value },
      schema: TrackResponseSchema,
      cache: 'no-store',
    });
    return { ok: true, results: data.results };
  } catch (error) {
    if (isApiError(error)) console.error(`[track-request] ${error.kind}: ${error.message}`);
    else console.error('[track-request] unexpected error', error);
    return { ok: false, results: [] };
  }
}

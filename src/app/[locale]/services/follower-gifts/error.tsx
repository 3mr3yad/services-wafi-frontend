'use client';

import { ErrorState } from '@/components/shared/error-state';

export default function FollowerGiftsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}

'use client';

import { ErrorState } from '@/components/shared/error-state';

// Errors inside the resale page stay inside the portal shell.
export default function ResaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}

'use client';

import { ErrorState } from '@/components/shared/error-state';

// Errors inside the refund page stay inside the portal shell.
export default function RefundError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}

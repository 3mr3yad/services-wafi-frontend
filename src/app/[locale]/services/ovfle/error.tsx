'use client';

import { ErrorState } from '@/components/shared/error-state';

// Errors inside the ovfle page stay inside the portal shell.
export default function OvfleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}

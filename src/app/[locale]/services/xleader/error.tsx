'use client';

import { ErrorState } from '@/components/shared/error-state';

// Errors inside Xleader stay inside the portal shell.
export default function XleaderError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}

'use client';

import { ErrorState } from '@/components/shared/error-state';

// Errors inside the installments page stay inside this route.
export default function InstallmentsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}

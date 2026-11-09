'use client';

import { ErrorState } from '@/components/shared/error-state';

// Errors inside the protection page stay inside its dark shell.
export default function ProtectionError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} className="min-h-[60vh] justify-center" />;
}

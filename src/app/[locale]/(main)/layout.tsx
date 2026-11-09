import type { ReactNode } from 'react';

// The homepage renders its own header and footer (ported from home.blade.php).
export default function MainSiteLayout({ children }: { children: ReactNode }) {
  return children;
}

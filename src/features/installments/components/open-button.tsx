'use client';

import type { ReactNode } from 'react';
import { type DialogTab, openRequestDialog } from './events';

/** A CTA that opens the request dialog (apply or track) instead of scrolling the page. */
export function OpenButton({ tab, type, className, children }: { tab: DialogTab; type?: 'phone' | 'car'; className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} aria-haspopup="dialog" onClick={() => openRequestDialog({ tab, type })}>
      {children}
    </button>
  );
}

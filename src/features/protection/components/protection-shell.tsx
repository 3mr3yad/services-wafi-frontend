import type { ReactNode } from 'react';
import { protectionFontVariables } from '../fonts';
import '../protection.css';
import { Cursor, Preloader, ScrollProgress } from './page-chrome';

/**
 * The protection page's own chrome (it never used the portal layout): preloader, custom cursor,
 * scroll progress bar and film grain, over a dark full-page background.
 * The page content only exists in Arabic, so the wrapper is always RTL.
 */
export function ProtectionShell({ children }: { children: ReactNode }) {
  return (
    <div data-service="protection" className={`wafi-protection ${protectionFontVariables}`} dir="rtl" lang="ar">
      <Preloader logo="/images/protection/logo.png" />
      <Cursor />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <main id="main-content">{children}</main>
    </div>
  );
}

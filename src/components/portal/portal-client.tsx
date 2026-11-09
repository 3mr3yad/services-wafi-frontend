'use client';

import { type ReactNode, useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useIsEmbedded } from './portal-header';

/** Renders children only when the page is not embedded (?embed=1). */
export function HideWhenEmbedded({ children }: { children: ReactNode }) {
  return useIsEmbedded() ? null : children;
}

/** Marks the portal root as embedded, like body.is-embedded in the old layout. */
export function EmbedMarker() {
  const embedded = useIsEmbedded();
  useEffect(() => {
    document.querySelector('.wafi-portal')?.classList.toggle('is-embedded', embedded);
  }, [embedded]);
  return null;
}

/** Scroll reveal for [data-reveal] (same thresholds as the old layout). Re-runs on every page change. */
export function PortalReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.wafi-portal [data-reveal]:not([data-revealed])'));
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.setAttribute('data-revealed', ''));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    );
    elements.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 50, 250)}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

'use client';

import { useEffect } from 'react';

/** Scroll reveal for [data-reveal] elements, same thresholds and stagger as home.blade.php. */
export function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.wafi-home [data-reveal]'));
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
  }, []);

  return null;
}

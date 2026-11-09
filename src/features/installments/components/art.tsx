import { BRAND } from '../brand';

/** Ovfle logo + icons (hand-drawn SVG in the brand palette). */

type IconName = 'phone' | 'car' | 'id' | 'wallet' | 'briefcase' | 'contact' | 'arrow' | 'check' | 'search' | 'spark' | 'x' | 'clock' | 'shield';

const ICONS: Record<IconName, string> = {
  phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  car: 'M5 17h-1a1 1 0 0 1-1-1v-3.2a2 2 0 0 1 .6-1.4L6 9l1.6-3.2A2 2 0 0 1 9.4 4.7h5.2a2 2 0 0 1 1.8 1.1L18 9l2.4 2.4a2 2 0 0 1 .6 1.4V16a1 1 0 0 1-1 1h-1M9 17h6M6 9h12M7.5 17a1.5 1.5 0 1 0 0 .01M16.5 17a1.5 1.5 0 1 0 0 .01',
  id: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 10a2 2 0 1 0 0 .01M6.5 16a3 3 0 0 1 5 0M14 9h4M14 13h3',
  wallet: 'M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M21 11h-5a2 2 0 0 0 0 4h5zM3 7h16',
  briefcase: 'M9 6V4h6v2M4 6h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1zM3 12h18',
  contact: 'M4 6h16v12H4zM4 7l8 6 8-6',
  arrow: 'M19 12H5M12 5l-7 7 7 7',
  check: 'M20 6 9 17l-5-5',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  spark: 'M13 2 4 14h7l-1 8 9-12h-7z',
  x: 'M6 6l12 12M18 6 6 18',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
};

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

/** Arrow that points "forward" in both directions (RTL flips it). */
export function ForwardArrow({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`${className} ltr:rotate-180`} aria-hidden="true">
      <path d={ICONS.arrow} />
    </svg>
  );
}

/** Official Ovfle logo: the wordmark from the brand book (Poppins Rounded style, sky blue on navy). */
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`ov-brandname ${className}`} dir="ltr" translate="no">
      {BRAND.wordmark}
    </span>
  );
}

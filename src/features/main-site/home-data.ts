// Static homepage data, ported from wafi-service (config/wafi_services.php + home.blade.php).
// Texts live in the message files (Home.services.<id>); only non-translatable values are here.

/** Public R2 bucket that hosts the hero background and step icons (same URLs as the old site). */
export const R2_BASE = 'https://pub-cd1e5941091142e598d320674a3dc645.r2.dev/Services-landing';

export const POLICY_URL =
  'https://wafi.sa/ar/%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B3%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D8%A9-%D9%88%D8%A7%D9%84%D8%B4%D8%B1%D9%88%D8%B7-%D9%88%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85';

export const SOCIAL_LINKS = [
  { label: 'Snapchat', icon: 'snap', href: 'https://www.snapchat.com/@wafi.s1' },
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/wafi.sa2/' },
  { label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@wafi.s1' },
  { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/profile.php?id=61558475500942' },
] as const;

/**
 * Display order and layout: 3 narrow cards then 2 wide ones. Ovfle has no card art (no $serviceArt entry on the old site).
 * Xleader was removed from the homepage on request (2026-11-09); its page /services/xleader still exists.
 */
export const HOME_SERVICES = [
  {
    id: 'resale',
    href: '/services/resale',
    wide: false,
    art: '/images/landing/tradein.png',
    icon: 'M20 7h-7l-1-2H4a2 2 0 0 0-2 2v10a3 3 0 0 0 3 3h13a3 3 0 0 0 3-3V9a2 2 0 0 0-2-2zM7 15h6',
  },
  {
    id: 'refund',
    href: '/services/refund',
    wide: false,
    art: '/images/landing/invoice.png',
    icon: 'M9 12h6M12 9v6M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
  },
  {
    id: 'ovfle',
    href: '/services/ovfle',
    wide: false,
    art: null,
    icon: 'M3 10h18M7 15h2m4 0h4M5 6h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  },
  {
    id: 'protection',
    href: '/services/protection',
    wide: true,
    art: '/images/landing/protection.png',
    icon: 'M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4z',
  },
  {
    id: 'customer_support',
    href: '/services/customer-support-request',
    wide: true,
    art: '/images/landing/headset.png',
    icon: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  },
] as const;

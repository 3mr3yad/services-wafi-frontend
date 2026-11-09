import localFont from 'next/font/local';

// Brand typography, following the OVFLE visual reference: Tajawal for Arabic, Poppins Rounded for Latin.
// Poppins Rounded isn't freely distributed, so regular Poppins (closest match) is used. Self-hosted from npm.

export const brandLatin = localFont({
  src: [
    { path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2', weight: '400' },
    { path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2', weight: '500' },
    { path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2', weight: '600' },
    { path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2', weight: '700' },
  ],
  variable: '--font-brand-latin',
  display: 'swap',
  adjustFontFallback: false,
});

export const brandArabic = localFont({
  src: [
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-400-normal.woff2', weight: '400' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-500-normal.woff2', weight: '500' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-700-normal.woff2', weight: '700' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-800-normal.woff2', weight: '800' },
  ],
  variable: '--font-brand-arabic',
  display: 'swap',
  adjustFontFallback: false,
});

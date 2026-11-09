import localFont from 'next/font/local';

// Tajawal (300–900), the service pages font in the old layouts/public.blade.php. Self-hosted from npm.
// Latin and Arabic subsets are separate families; portal.css chains them.

export const tajawalLatin = localFont({
  src: [
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-latin-300-normal.woff2', weight: '300' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-latin-400-normal.woff2', weight: '400' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-latin-500-normal.woff2', weight: '500' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-latin-700-normal.woff2', weight: '700' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-latin-800-normal.woff2', weight: '800' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-latin-900-normal.woff2', weight: '900' },
  ],
  variable: '--font-tajawal-latin',
  display: 'swap',
  adjustFontFallback: false,
});

export const tajawalArabic = localFont({
  src: [
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-300-normal.woff2', weight: '300' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-400-normal.woff2', weight: '400' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-500-normal.woff2', weight: '500' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-700-normal.woff2', weight: '700' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-800-normal.woff2', weight: '800' },
    { path: '../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-900-normal.woff2', weight: '900' },
  ],
  variable: '--font-tajawal-arabic',
  display: 'swap',
  adjustFontFallback: false,
});

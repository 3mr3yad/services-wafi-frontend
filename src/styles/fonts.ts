import localFont from 'next/font/local';

// Self-hosted from npm (@fontsource) so builds never depend on reaching Google Fonts.
// Cairo is the main website font (same as the old wafiservices homepage), for both languages.
// It ships as separate Arabic and Latin subset files, so each subset is its own family
// and the browser picks per glyph from the stack in globals.css.

export const cairoArabic = localFont({
  src: '../../node_modules/@fontsource-variable/cairo/files/cairo-arabic-wght-normal.woff2',
  weight: '200 1000',
  variable: '--font-cairo-arabic',
  display: 'swap',
  adjustFontFallback: false, // no Arial fallback inside the variable, so Arabic + Latin subsets chain correctly
});

export const cairoLatin = localFont({
  src: '../../node_modules/@fontsource-variable/cairo/files/cairo-latin-wght-normal.woff2',
  weight: '200 1000',
  variable: '--font-cairo-latin',
  display: 'swap',
  adjustFontFallback: false, // no Arial fallback inside the variable, so Arabic + Latin subsets chain correctly
});

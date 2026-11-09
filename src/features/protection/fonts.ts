import localFont from 'next/font/local';

// The original page used IBM Plex Sans Arabic (body, --font-ar) and Space Grotesk (numbers / latin labels, --font-en),
// both from Google Fonts. Self-hosted here from the installed @fontsource packages.
// Plex ships Arabic and Latin subsets as separate files, so each subset is its own family (Latin first, then Arabic).


export const plexLatin = localFont({
  src: [
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-protection-ar-latin',
  display: 'swap',
  adjustFontFallback: false,
});

export const plexArabic = localFont({
  src: [
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-protection-ar-arabic',
  display: 'swap',
  adjustFontFallback: false,
});

export const spaceGrotesk = localFont({
  src: '../../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  variable: '--font-protection-en',
  display: 'swap',
  adjustFontFallback: false,
});

export const protectionFontVariables = `${plexLatin.variable} ${plexArabic.variable} ${spaceGrotesk.variable}`;

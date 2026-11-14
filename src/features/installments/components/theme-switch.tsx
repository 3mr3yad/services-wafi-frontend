'use client';

import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Temporary dark / light switch for choosing the Ovfle theme (BRAND.themePreview). Full page loads on purpose
 * (the theme is decided on the server from ?theme=). Remove once the theme is chosen.
 */
export function ThemeSwitch({ current, labels }: { current: 'dark' | 'light'; labels: { title: string; dark: string; light: string } }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const href = (theme: 'dark' | 'light') => {
    const next = new URLSearchParams(params.toString());
    next.set('theme', theme);
    return `${pathname}?${next.toString()}`;
  };

  return (
    <div
      className="fixed bottom-4 z-[70] flex items-center gap-1 rounded-full border border-(--ov-tint)/15 bg-(--ov-surface)/90 p-1 text-xs font-bold shadow-[0_12px_30px_-12px_rgb(0_0_0/0.45)] backdrop-blur-xl ltr:right-4 rtl:left-4"
      role="group"
      aria-label={labels.title}
    >
      <span className="px-2.5 text-(--ov-ink)/60">{labels.title}</span>
      {(['dark', 'light'] as const).map((theme) => (
        <a
          key={theme}
          href={href(theme)}
          aria-current={current === theme ? 'true' : undefined}
          className={`rounded-full px-3.5 py-2 transition ${
            current === theme ? 'bg-[#7DE6EE] text-[#11131A]' : 'text-(--ov-fg) hover:bg-(--ov-tint)/10'
          }`}
        >
          {theme === 'dark' ? labels.dark : labels.light}
        </a>
      ))}
    </div>
  );
}

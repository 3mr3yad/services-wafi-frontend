'use client';

import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ForwardArrow, Icon } from './art';
import type { InstallmentKind } from './events';
import { HeroLights } from './hero-lights';
import { OpenButton } from './open-button';

export interface HeroSlide {
  id: string;
  /** Wide photo (1536×864) with the subject on its left side; the copy sits on the start side. */
  image: string;
  /** Light layer tuned to /images/ovfle/hero.webp only. */
  lights?: boolean;
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  primary: { label: string; type?: InstallmentKind };
  secondary: { label: string; action: 'track' | 'how' };
  partners?: { label: string; items: { name: string; logo: string | null }[] };
}

/** Seconds each slide stays before auto-advancing. */
const SLIDE_SECONDS = 7;

/**
 * Ovfle hero carousel. Every slide keeps the existing hero motion (ken-burns, road sweep, scroll drift, mirrored
 * photo in LTR); slides cross-fade and the copy re-enters on each change. Slides advance on a timer (also under
 * prefers-reduced-motion, where only the transitions are dropped); it stops while the tab is hidden or when the
 * visitor presses the pause button (WCAG 2.2.2), and restarts after any manual navigation.
 */
export function HeroSlider({
  slides,
  labels,
  footer,
}: {
  slides: HeroSlide[];
  labels: { region: string; prev: string; next: string; go: string; pause: string; play: string };
  /** Rendered under the copy on every slide (disclaimer). */
  footer?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((to: number) => setIndex(((to % count) + count) % count), [count]);
  const paused = userPaused || hidden;

  // Stop while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Auto-advance; re-armed on every slide change, so manual navigation gives the new slide its full time.
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null || event.pointerType === 'mouse') return;
    const dx = event.clientX - start;
    if (Math.abs(dx) < 50) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    // Swipe towards the reading direction's start = next slide.
    go(index + ((dx > 0) === rtl ? 1 : -1));
  };

  return (
    <section
      className="ov-slider relative"
      aria-roledescription="carousel"
      aria-label={labels.region}
      data-paused={paused ? '' : undefined}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
        go(index + ((e.key === 'ArrowLeft') === rtl ? 1 : -1));
      }}
      onPointerDown={(e) => {
        swipeStart.current = e.clientX;
      }}
      onPointerUp={onPointerUp}
    >
      <div className="ov-hero-media relative h-[min(82vw,26rem)] overflow-hidden lg:absolute lg:inset-0 lg:h-auto">
        {/* Mirrored in LTR (on a wrapper, so the flip doesn't share the zoom's transform-origin). */}
        <div className="ov-hero-frame h-full w-full ltr:-scale-x-100">
          {slides.map((slide, i) => (
            <div key={slide.id} className={`ov-slide-media${i === index ? ' is-active' : ''}`} aria-hidden="true">
              {/* Photo + light layer share one cover-sized box, so the lights stay on the towers / headlights. */}
              <div className="ov-hero-img ov-hero-cover">
                <img src={slide.image} alt="" fetchPriority={i === 0 ? 'high' : 'low'} decoding="async" />
                {slide.lights && <HeroLights />}
              </div>
            </div>
          ))}
        </div>
        <span className="ov-hero-sweep" aria-hidden="true" />
        <div className="ov-hero-scrim absolute inset-0" />
      </div>

      <div className="relative mx-auto -mt-8 max-w-6xl px-4 pb-14 sm:px-6 lg:mt-0 lg:flex lg:min-h-[44rem] lg:items-center lg:py-24">
        <div className="ov-hero-copy w-full max-w-xl text-center lg:text-start">
          {/* All slides share one grid cell, so the block keeps the height of the tallest one (no jump). */}
          <div className="grid">
            {slides.map((slide, i) => {
              const active = i === index;
              const Title = i === 0 ? 'h1' : 'h2';
              return (
                <div
                  key={slide.id}
                  className={`ov-slide-copy${active ? ' is-active' : ''}`}
                  style={{ gridArea: '1 / 1' }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${count}`}
                  aria-hidden={!active}
                  inert={!active}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#7DE6EE]/30 bg-[#7DE6EE]/10 px-4 py-1.5 text-xs font-bold text-[#7DE6EE]">
                    <Icon name="spark" className="h-3.5 w-3.5" />
                    {slide.eyebrow}
                  </span>
                  <Title className="mt-6 text-4xl leading-[1.25] font-extrabold tracking-tight text-white drop-shadow-[0_2px_24px_rgb(17_19_26/0.8)] sm:text-5xl lg:text-[3.4rem]">
                    <span className="block">{slide.title1}</span>
                    <span className="ov-shine-text mt-2 block">{slide.title2}</span>
                  </Title>
                  <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#E6FAFC]/70 lg:mx-0">{slide.subtitle}</p>
                  {slide.partners && (
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                      <span className="text-xs font-bold text-[#E6FAFC]/55">{slide.partners.label}:</span>
                      {slide.partners.items.map((partner) =>
                        partner.logo ? (
                          <span key={partner.name} className="inline-flex h-9 items-center rounded-full bg-white px-3.5 shadow-[0_8px_24px_-12px_rgb(125_230_238/0.6)]">
                            <img src={partner.logo} alt={partner.name} className="h-6 w-auto max-w-28 object-contain" />
                          </span>
                        ) : (
                          <span key={partner.name} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                            {partner.name}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                  <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                    <OpenButton tab="apply" type={slide.primary.type} className="ov-btn ov-btn-primary">
                      {slide.primary.label}
                      <ForwardArrow />
                    </OpenButton>
                    {slide.secondary.action === 'track' ? (
                      <OpenButton tab="track" className="ov-btn ov-btn-ghost">
                        <Icon name="search" className="h-4 w-4" />
                        {slide.secondary.label}
                      </OpenButton>
                    ) : (
                      <a href="#how" className="ov-btn ov-btn-ghost">
                        {slide.secondary.label}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {footer}

          {/* Controls: prev / dots (with the auto-advance progress) / next */}
          <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
            <button type="button" className="ov-slider-arrow" aria-label={labels.prev} onClick={() => go(index - 1)}>
              {/* Static arrow points left (= back in LTR); flipped in RTL where "back" is to the right. */}
              <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" strokeWidth={2.2} />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`ov-slider-dot${i === index ? ' is-active' : ''}`}
                  aria-label={labels.go.replace('{n}', String(i + 1))}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => go(i)}
                >
                  {i === index && (
                    <span
                      // Visual only (the timer advances); remounted per slide and on resume so it restarts in sync.
                      key={`${index}-${paused}`}
                      className="ov-slider-progress"
                      style={{ '--ov-slide-s': `${SLIDE_SECONDS}s` } as CSSProperties}
                    />
                  )}
                </button>
              ))}
            </div>
            <button type="button" className="ov-slider-arrow" aria-label={labels.next} onClick={() => go(index + 1)}>
              <ForwardArrow className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="ov-slider-arrow"
              aria-label={userPaused ? labels.play : labels.pause}
              aria-pressed={userPaused}
              onClick={() => setUserPaused((v) => !v)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                {userPaused ? <path d="M8 5.5v13l11-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

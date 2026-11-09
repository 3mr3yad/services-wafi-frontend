'use client';

import { useEffect, useState } from 'react';
import { Magnetic, openFormDock } from './motion';
import type { CssVars } from './motion';

export interface HeroContent {
  kicker: string;
  title: string[];
  lead: string;
  primary: string;
  secondary: string;
  features: string[];
  scroll: string;
  scrollLabel: string;
}

const VIDEO = {
  web: {
    src: 'https://pub-cd1e5941091142e598d320674a3dc645.r2.dev/protect-videos/banner-web.mp4',
    poster: '/images/protection/hero-web-poster.jpg',
  },
  mobile: {
    src: 'https://pub-cd1e5941091142e598d320674a3dc645.r2.dev/protect-videos/banner-mobile.mp4',
    poster: '/images/protection/hero-mobile-poster.jpg',
  },
};

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width:720px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return mobile;
}

const enter = (delay: number, y: number, duration = 0.8): CssVars => ({ '--edelay': `${delay}s`, '--ey': `${y}px`, '--edur': `${duration}s` });

export function Hero({ content }: { content: HeroContent }) {
  const video = useIsMobile() ? VIDEO.mobile : VIDEO.web;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={'hero' + (mounted ? ' is-mounted' : '')} id="hero">
      <div className="hero__video" aria-hidden="true">
        <video key={video.src} className="hero__vid" autoPlay muted loop playsInline preload="auto" poster={video.poster}>
          <source src={video.src} type="video/mp4" />
        </video>
        <span className="hero__scrim" />
      </div>
      <div className="hero__inner">
        <div className="hero__col--text">
          <p className="hero__kicker wp-enter" style={enter(0.1, 20, 0.7)}>
            <i />
            {content.kicker}
          </p>
          <h1 className="hero__title">
            {content.title.map((line, i) => (
              <span key={i} className="reveal-line">
                <span
                  className={'hero__word' + (i === content.title.length - 1 ? ' is-accent' : '')}
                  style={{ '--edelay': `${0.2 + 0.09 * i}s` } as CssVars}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero__lead wp-enter" style={enter(0.55, 24)}>
            {content.lead}
          </p>
          <div className="hero__actions wp-enter" style={enter(0.7, 24)}>
            <Magnetic>
              <button type="button" onClick={openFormDock} className="btn btn--solid">
                <span>{content.primary}</span>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M14 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={openFormDock} className="btn btn--ghost">
                <span>{content.secondary}</span>
              </button>
            </Magnetic>
          </div>
          <ul className="hero__features wp-enter" style={enter(0.85, 24)}>
            {content.features.map((feature) => (
              <li key={feature}>
                <b>—</b>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <a href="#about" className="hero__scroll" aria-label={content.scrollLabel}>
        <span>{content.scroll}</span>
        <i />
      </a>
    </section>
  );
}

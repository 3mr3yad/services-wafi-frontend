'use client';

import { Magnetic, openFormDock, Reveal, useReveal, useTilt } from './motion';
import type { CssVars } from './motion';

export interface WarrantyContent {
  kicker: string;
  headline: string;
  body: string;
  cta: string;
  steps: { no: string; title: string; desc: string }[];
  panelTitle: string;
  previewNext: string;
  badgeSecure: string;
  badgeInstant: string;
  hint: string;
}

const ICONS = [
  <>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </>,
  <>
    <rect x="8" y="3" width="8" height="18" rx="2" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </>,
  <>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </>,
];

export function Warranty({ content }: { content: WarrantyContent }) {
  const [previewRef, previewIn] = useReveal<HTMLDivElement>({ amount: 0.3 });
  const { ref: card, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>((x, y) => `rotateY(${12 * x}deg) rotateX(${-(12 * y)}deg)`);

  return (
    <section className="section" id="warranty">
      <div className="warranty__inner">
        <div className="warranty__text">
          <Reveal as="p" className="section-kicker">
            <i />
            {content.kicker}
          </Reveal>
          <Reveal as="h2" className="warranty__headline" delay={0.05}>
            {content.headline}
          </Reveal>
          <Reveal as="p" className="warranty__body" delay={0.1}>
            {content.body}
          </Reveal>
          <ol className="warranty__steps">
            {content.steps.map((step, i) => (
              <Reveal key={step.no} as="li" className="wstep" delay={i * 0.08}>
                <span className="wstep__no">{step.no}</span>
                <div>
                  <h3 className="wstep__title">{step.title}</h3>
                  <p className="wstep__desc">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.1}>
            <Magnetic>
              <button type="button" className="btn btn--solid" onClick={openFormDock}>
                <span>{content.cta}</span>
              </button>
            </Magnetic>
          </Reveal>
        </div>
        <Reveal className="warranty__panel">
          <div className={'formPreview' + (previewIn ? ' is-in' : '')} ref={previewRef}>
            <div className="formEmbed__bar">
              <span />
              <span />
              <span />
              <b>{content.panelTitle}</b>
            </div>
            <div className="formPreview__body">
              <div className="formPreview__scene" aria-hidden="true">
                <span className="formPreview__glow" />
                <span className="formPreview__pulse" style={{ '--pd': '0s' } as CssVars} />
                <span className="formPreview__pulse" style={{ '--pd': '1.3s' } as CssVars} />
                <div className="formPreview__card" ref={card} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
                  {ICONS.map((icon, i) => (
                    <div key={i} className="formPreview__row">
                      <span className="formPreview__icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {icon}
                        </svg>
                      </span>
                      <span className="formPreview__line" />
                    </div>
                  ))}
                  <span className="formPreview__cta">
                    <span>{content.previewNext}</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 5l-7 7 7 7" />
                    </svg>
                  </span>
                </div>
                <span className="formPreview__badge formPreview__badge--1">
                  <i>🔒</i> {content.badgeSecure}
                </span>
                <span className="formPreview__badge formPreview__badge--2">
                  <i>⚡</i> {content.badgeInstant}
                </span>
              </div>
              <p className="formPreview__hint">{content.hint}</p>
              <Magnetic>
                <button type="button" className="btn btn--solid" onClick={openFormDock}>
                  <span>{content.cta}</span>
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

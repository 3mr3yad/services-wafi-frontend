'use client';

import { useState } from 'react';
import { openFormDock, Reveal } from './motion';

export interface Product {
  no: string;
  name: string;
  category: string;
  desc: string;
  img: string;
}

/**
 * Two side-by-side product panels; the hovered one widens, the other dims.
 * (The original also had a carousel variant for 3+ products, unused on this page.)
 */
export function ProductsDuel({ items, kicker, title, cta }: { items: Product[]; kicker: string; title: string; cta: string }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="section duel" id="products">
      <div className="duel__head">
        <Reveal as="p" className="section-kicker">
          <i />
          {kicker}
        </Reveal>
        <Reveal as="h2" className="products__title" delay={0.05}>
          {title}
        </Reveal>
      </div>
      <div className="duel__row" onMouseLeave={() => setActive(null)}>
        {items.map((item, i) => (
          <div
            key={item.no}
            className={'duel__panel' + (active === i ? ' is-active' : active !== null ? ' is-dim' : '')}
            onMouseEnter={() => setActive(i)}
          >
            <img
              alt={item.name}
              loading="lazy"
              decoding="async"
              className="duel__img"
              style={{ position: 'absolute', height: '100%', width: '100%', inset: 0, color: 'transparent' }}
              src={item.img}
            />
            <span className="duel__scrim" aria-hidden="true" />
            <span className="duel__no">{item.no}</span>
            <div className="duel__content">
              <span className="card__cat">{item.category}</span>
              <h3 className="duel__name">{item.name}</h3>
              <p className="duel__desc">{item.desc}</p>
              <button type="button" onClick={openFormDock} className="btn btn--solid card__cta">
                <span>{cta}</span>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M14 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useReveal, useTilt } from './motion';
import type { CssVars } from './motion';

/** Floating product photo with pulse rings and callouts; tilts towards the pointer. */
export function ProtectionLayers({ labels, caption, image }: { labels: string[]; caption: string; image: string }) {
  const [ref, inView] = useReveal<HTMLDivElement>({ amount: 0.4 });
  const { ref: stage, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>((x, y) => `rotateX(${-(10 * y)}deg) rotateY(${18 * x}deg)`);

  return (
    <div ref={ref} className={'holo' + (inView ? ' in' : '') + ' holo--photo'}>
      <div className="holo__frame" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <div ref={stage} className="holo__stage">
          <div className="holo__photo">
            <span className="holo__ring holo__ring--1" />
            <span className="holo__ring holo__ring--2" />
            <span className="holo__pulse" style={{ '--pd': '0s' } as CssVars} />
            <span className="holo__pulse" style={{ '--pd': '1s' } as CssVars} />
            <span className="holo__pulse" style={{ '--pd': '2s' } as CssVars} />
            <div className="holo__photo-card">
              <img
                alt=""
                loading="lazy"
                decoding="async"
                className="holo__photo-img"
                style={{ position: 'absolute', height: '100%', width: '100%', inset: 0, color: 'transparent' }}
                src={image}
              />
            </div>
          </div>
        </div>
        {labels.map((label, i) => (
          <div key={label} className={`holo__callout holo__callout--${i + 1}`} style={{ '--i': i } as CssVars}>
            <span className="holo__callout-line" />
            <span className="holo__callout-label">{label}</span>
          </div>
        ))}
      </div>
      <p className="layers__caption">{caption}</p>
    </div>
  );
}

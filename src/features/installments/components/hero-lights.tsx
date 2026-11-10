import type { CSSProperties } from 'react';

/**
 * Light layer over the hero photo (/images/ovfle/hero.webp, 1536×864). Every position is a % of the photo, and the
 * layer sits inside the same cover-sized box as the <img>, so lights stay on the towers / headlights at any crop and
 * follow the existing ken-burns, scroll drift and LTR mirror. Pure CSS (opacity animations only, no JS).
 */

type Box = { x0: number; x1: number; y0: number; y1: number; n: number; warm?: number };

/** Lit towers (x/y ranges in % of the photo) and how many window lights to scatter on each. */
const TOWERS: Box[] = [
  { x0: 17.2, x1: 20.3, y0: 38, y1: 53, n: 12 }, // Kingdom tower body
  { x0: 27.2, x1: 29.0, y0: 40, y1: 51, n: 8, warm: 0.6 }, // spire
  { x0: 4.0, x1: 6.6, y0: 39, y1: 54, n: 9 },
  { x0: 12.4, x1: 14.4, y0: 45, y1: 58, n: 7 },
  { x0: 9.4, x1: 11.4, y0: 50, y1: 58, n: 5, warm: 0.4 },
  { x0: 33.4, x1: 35.8, y0: 44, y1: 52, n: 6 },
  { x0: 22.6, x1: 24.6, y0: 45, y1: 51, n: 4, warm: 0.5 },
  { x0: 43.8, x1: 46.6, y0: 50, y1: 61, n: 8 },
  { x0: 47.6, x1: 49.4, y0: 55, y1: 61, n: 4 },
  { x0: 53.0, x1: 55.2, y0: 50, y1: 64, n: 8 },
  { x0: 56.1, x1: 57.2, y0: 58, y1: 64, n: 3 },
  { x0: 59.3, x1: 60.8, y0: 60, y1: 65, n: 3, warm: 0.5 },
  { x0: 62.6, x1: 64.0, y0: 59, y1: 65, n: 3 },
  { x0: 65.2, x1: 66.9, y0: 57, y1: 64, n: 5 },
  { x0: 80.8, x1: 81.6, y0: 61, y1: 66, n: 2 },
  { x0: 83.8, x1: 84.9, y0: 58, y1: 66, n: 3 },
];

/** Big soft glows that breathe over the brightest towers. */
const GLOWS: Array<[x: number, y: number, w: number, h: number]> = [
  [18.7, 34, 6.5, 14], [18.7, 46, 5, 16], [28.1, 41, 4, 19], [5.4, 45, 4, 18], [13.4, 50, 4, 15], [34.6, 47, 3.6, 10],
  [44.6, 55, 4, 13], [54.1, 56, 3.6, 15], [48.5, 58, 2.6, 7], [66.1, 60.5, 3, 9], [81.2, 63, 2.4, 7], [84.4, 62, 2.4, 9],
];

/** Warm street lamps on the left and the distant city strip behind the road. */
const LAMPS: Array<[x: number, y: number]> = [[6.6, 53.4], [12.2, 57], [1.5, 60.3], [4.6, 61.4], [9.6, 62], [7.4, 63.4]];
/** Cyan lane lights on the road (right side) + their reflection on the wet asphalt. */
const LANE: Array<[x: number, y: number]> = [[61.2, 70], [69, 69.4], [90.2, 70.8], [4.8, 69.2]];
/** Aviation warning lights on the tallest tops. */
const BEACONS: Array<[x: number, y: number]> = [[18.75, 28.6], [28, 33.4], [5.4, 37.6], [54, 49.8], [44.6, 49.6]];

/** Deterministic PRNG so server and client render the same scatter. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = rng(1536);
const r2 = (v: number) => Math.round(v * 100) / 100;

const WINDOWS = TOWERS.flatMap((box) =>
  Array.from({ length: box.n }, () => ({
    x: r2(box.x0 + rand() * (box.x1 - box.x0)),
    y: r2(box.y0 + rand() * (box.y1 - box.y0)),
    warm: rand() < (box.warm ?? 0.2),
    d: r2(rand() * 6),
    t: r2(2.2 + rand() * 4),
  })),
);

/** Distant skyline dots along the horizon (y ≈ 65–67%). */
const CITY_DOTS = Array.from({ length: 34 }, () => ({
  x: r2(56 + rand() * 40),
  y: r2(65.2 + rand() * 2),
  warm: rand() < 0.55,
  d: r2(rand() * 5),
  t: r2(1.8 + rand() * 3),
}));

const at = (x: number, y: number, extra?: Record<string, string | number>) => ({ left: `${x}%`, top: `${y}%`, ...extra }) as CSSProperties;

export function HeroLights() {
  return (
    <div className="ov-lights" aria-hidden="true">
      {GLOWS.map(([x, y, w, h], i) => (
        <span key={`g${i}`} className="ov-l-glow" style={at(x, y, { width: `${w}%`, height: `${h}%`, '--d': `${r2((i * 0.73) % 3.4)}s`, '--t': `${3 + (i % 4) * 0.6}s` })} />
      ))}
      {WINDOWS.map((w, i) => (
        <span key={`w${i}`} className={`ov-l-dot${w.warm ? ' is-warm' : ''}`} style={at(w.x, w.y, { '--d': `${w.d}s`, '--t': `${w.t}s` })} />
      ))}
      {CITY_DOTS.map((c, i) => (
        <span key={`c${i}`} className={`ov-l-dot is-far${c.warm ? ' is-warm' : ''}`} style={at(c.x, c.y, { '--d': `${c.d}s`, '--t': `${c.t}s` })} />
      ))}
      {LAMPS.map(([x, y], i) => (
        <span key={`s${i}`} className="ov-l-lamp" style={at(x, y, { '--d': `${i * 0.45}s`, '--t': `${2.4 + (i % 3) * 0.5}s` })} />
      ))}
      {LANE.map(([x, y], i) => (
        <span key={`r${i}`} className="ov-l-lane" style={at(x, y, { '--d': `${i * 0.6}s` })} />
      ))}
      {BEACONS.map(([x, y], i) => (
        <span key={`b${i}`} className="ov-l-beacon" style={at(x, y, { '--d': `${i * 0.55}s` })} />
      ))}

      {/* Headlights: ignite (flicker, then on), breathe, and double-flash every few seconds. */}
      <span className="ov-l-road" />
      <span className="ov-l-hl ov-l-bloom ov-l-left" />
      <span className="ov-l-hl ov-l-core ov-l-left" />
      <span className="ov-l-hl ov-l-streak ov-l-left" />
      <span className="ov-l-hl ov-l-bloom ov-l-right" />
      <span className="ov-l-hl ov-l-core ov-l-right" />
      <span className="ov-l-hl ov-l-streak ov-l-right" />
    </div>
  );
}

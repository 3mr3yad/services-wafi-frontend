/**
 * Ovfle creative illustrations (hand-built SVG in the brand palette: navy #11131A, sky #7DE6EE, ice #E6FAFC).
 * All motion is CSS (see ovfle.css) and switches off with prefers-reduced-motion.
 */
import { Icon, PhoneArt, Wordmark } from './ovfle-art';

const SKY = '#7DE6EE';

/* ------------------------------------------------------------------ */
/* Animated car (side profile) — wheels spin, headlight glows          */
/* ------------------------------------------------------------------ */

const CAR_BODY =
  'M18 158V146c0-12 10-20 28-23l58-9c22-22 48-36 82-38h76c30 0 52 12 78 36l40 6c20 3 32 14 34 30v10c0 6-4 10-10 10h-22a30 30 0 0 0-60 0H128a30 30 0 0 0-60 0H28c-6 0-10-4-10-10z';

function Wheel({ cx }: { cx: number }) {
  return (
    <g className="ov-wheel" style={{ transformOrigin: `${cx}px 168px` }}>
      <circle cx={cx} cy="168" r="22" />
      <circle cx={cx} cy="168" r="8" />
      <path d={`M${cx} 146v14M${cx} 176v14M${cx - 22} 168h14M${cx + 8} 168h14`} opacity="0.6" />
    </g>
  );
}

export function AnimatedCar({ className = '', id = 'car' }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 470 200" fill="none" className={className} aria-hidden="true">
      <defs>
        <filter id={`${id}-glow`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY} stopOpacity="0.2" />
          <stop offset="1" stopColor={SKY} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SKY} stopOpacity="0.55" />
          <stop offset="1" stopColor={SKY} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* headlight beam */}
      <path d="M410 140 470 120V170Z" fill={`url(#${id}-beam)`} className="ov-beam" />
      <ellipse cx="216" cy="190" rx="200" ry="6" fill={SKY} opacity="0.2" />
      <path d={CAR_BODY} fill={`url(#${id}-fill)`} />
      <g stroke={SKY} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" filter={`url(#${id}-glow)`}>
        <path d={CAR_BODY} className="ov-draw" />
        <path d="M118 114c20-18 42-26 68-27h36v27zM232 87h30c22 0 38 9 56 27h-86z" />
        <path d="M196 132h16M300 128h26M40 140h18" />
        <Wheel cx={98} />
        <Wheel cx={352} />
      </g>
      <circle cx="404" cy="140" r="4" fill={SKY} className="ov-headlight" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero scene: skyline + road + driving car + floating phone + chips   */
/* ------------------------------------------------------------------ */

// Deterministic "random" skyline so server and client render the same markup.
const BUILDINGS = [
  { x: 0, w: 46, h: 120 },
  { x: 50, w: 34, h: 170 },
  { x: 88, w: 52, h: 96 },
  { x: 144, w: 40, h: 200 },
  { x: 188, w: 58, h: 132 },
  { x: 250, w: 36, h: 182 },
  { x: 290, w: 50, h: 110 },
  { x: 344, w: 42, h: 160 },
  { x: 390, w: 56, h: 124 },
  { x: 450, w: 38, h: 190 },
  { x: 492, w: 48, h: 104 },
  { x: 544, w: 36, h: 150 },
];

function Skyline() {
  const base = 240;
  return (
    <svg viewBox="0 0 580 240" className="absolute inset-x-0 bottom-[22%] w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="ov-bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2330" />
          <stop offset="1" stopColor="#11131a" />
        </linearGradient>
      </defs>
      {BUILDINGS.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill="url(#ov-bld)" stroke={SKY} strokeOpacity="0.12" />
          {Array.from({ length: Math.floor((b.h - 20) / 18) }, (_, row) =>
            Array.from({ length: Math.floor((b.w - 10) / 12) }, (_, col) => {
              const seed = (i * 31 + row * 7 + col * 13) % 11;
              if (seed > 3) return null;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={b.x + 7 + col * 12}
                  y={base - b.h + 12 + row * 18}
                  width="5"
                  height="7"
                  rx="1"
                  fill={SKY}
                  className="ov-window"
                  style={{ animationDelay: `${(seed * 0.7 + row * 0.3) % 4}s`, opacity: 0.25 + seed * 0.12 }}
                />
              );
            }),
          )}
        </g>
      ))}
    </svg>
  );
}

function Road() {
  return (
    <svg viewBox="0 0 580 90" className="absolute inset-x-0 bottom-0 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ov-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1d27" />
          <stop offset="1" stopColor="#0d0f14" />
        </linearGradient>
        <linearGradient id="ov-road-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SKY} stopOpacity="0" />
          <stop offset="0.5" stopColor={SKY} stopOpacity="0.8" />
          <stop offset="1" stopColor={SKY} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect y="0" width="580" height="90" fill="url(#ov-road)" />
      <rect y="0" width="580" height="2" fill="url(#ov-road-edge)" />
      <line x1="-40" y1="48" x2="620" y2="48" stroke={SKY} strokeOpacity="0.45" strokeWidth="3" strokeDasharray="28 22" className="ov-lane" />
    </svg>
  );
}

export function HeroScene({ phoneTitle, phoneCaption, months, chips }: { phoneTitle: string; phoneCaption: string; months: string; chips: [string, string, string] }) {
  return (
    <div className="ov-scene relative mx-auto aspect-[6/5] w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-[#7DE6EE]/15 bg-gradient-to-b from-[#141722] to-[#0c0e13]" aria-hidden="true">
      {/* moon / glow */}
      <div className="absolute top-8 h-40 w-40 rounded-full bg-[#7DE6EE]/20 blur-3xl ltr:left-10 rtl:right-10" />
      <div className="absolute top-12 h-14 w-14 rounded-full border border-[#7DE6EE]/30 bg-[#E6FAFC]/5 ltr:left-16 rtl:right-16" />
      <Skyline />
      <div className="absolute inset-x-0 bottom-0 h-[24%]">
        <Road />
      </div>

      {/* The car drives in and keeps rolling on the spot */}
      <div className="absolute bottom-[8%] w-[78%] ltr:left-[2%] rtl:left-[2%]">
        <div className="ov-drive-in">
          <div className="ov-bob">
            <AnimatedCar id="hero-car" className="w-full" />
          </div>
        </div>
      </div>

      {/* Floating phone with the installment plan */}
      <div className="ov-float absolute top-[6%] right-[4%]" style={{ animationDelay: '1.2s' }}>
        <div className="ov-pop-in" style={{ animationDelay: '0.9s' }}>
          <PhoneArt title={phoneTitle} caption={phoneCaption} months={months} className="origin-top-right scale-[0.62] sm:scale-[0.7]" />
        </div>
      </div>

      {/* Floating chips */}
      <div className="ov-chip absolute top-[16%] left-[8%]" style={{ animationDelay: '0.4s' }}>
        <Icon name="phone" className="h-4 w-4 text-[#7DE6EE]" />
        {chips[0]}
      </div>
      <div className="ov-chip absolute top-[34%] left-[30%]" style={{ animationDelay: '1s' }}>
        <Icon name="car" className="h-4 w-4 text-[#7DE6EE]" />
        {chips[1]}
      </div>
      <div className="ov-chip absolute top-[52%] right-[6%]" style={{ animationDelay: '1.6s' }}>
        <Icon name="clock" className="h-4 w-4 text-[#7DE6EE]" />
        {chips[2]}
      </div>

      {/* Sparkles */}
      {[
        ['12%', '58%', '0s'],
        ['26%', '82%', '1.3s'],
        ['8%', '40%', '2.1s'],
        ['44%', '12%', '0.7s'],
      ].map(([top, left, delay]) => (
        <span key={`${top}-${left}`} className="ov-sparkle absolute h-1.5 w-1.5 rounded-full bg-[#7DE6EE]" style={{ top, left, animationDelay: delay }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Option card art                                                     */
/* ------------------------------------------------------------------ */

/** Phone with monthly payment tiles lighting up one after another. */
export function PhonePlanArt({ months }: { months: string }) {
  const tiles = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="relative flex h-48 items-center justify-center" aria-hidden="true">
      <div className="absolute h-40 w-40 rounded-full bg-[#7DE6EE]/10 blur-2xl" />
      {/* orbit ring */}
      <svg viewBox="0 0 200 200" className="ov-spin-slow absolute h-44 w-44">
        <circle cx="100" cy="100" r="92" fill="none" stroke={SKY} strokeOpacity="0.25" strokeDasharray="3 9" />
        <circle cx="100" cy="8" r="4" fill={SKY} />
      </svg>
      <div className="relative z-10 flex h-40 w-[5.5rem] flex-col rounded-[1.4rem] border border-white/15 bg-[#0b0d13] p-1.5 ov-neon">
        <div className="flex flex-1 flex-col rounded-[1.1rem] bg-gradient-to-b from-[#171a24] to-[#0f1118] px-2 pt-4 pb-2">
          <Wordmark className="text-sm" />
          <div className="mt-2 grid grid-cols-3 gap-1" dir="ltr">
            {tiles.map((n) => (
              <span key={n} className="ov-tile flex h-4 items-center justify-center rounded-[4px] text-[7px] font-semibold" style={{ animationDelay: `${n * 0.35}s` }}>
                {n}
              </span>
            ))}
          </div>
          <div className="mt-auto text-center text-[8px] text-[#E6FAFC]/50">
            12 {months}
          </div>
        </div>
      </div>
      {/* coins dropping in */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="ov-coin absolute z-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#11131A]/20 bg-[#7DE6EE] text-[9px] font-bold text-[#11131A]"
          style={{ animationDelay: `${i * 1.1}s`, left: `calc(50% + ${(i - 1) * 46}px)` }}
        >
          ﷼
        </span>
      ))}
    </div>
  );
}

/** Car on a glowing podium, like the brand's product mockups, with a key and a payment-progress ring. */
export function CarPodiumArt() {
  return (
    <div className="relative flex h-48 items-end justify-center" aria-hidden="true">
      <div className="absolute bottom-6 h-24 w-72 rounded-[50%] bg-[#7DE6EE]/15 blur-2xl" />
      {/* podium */}
      <svg viewBox="0 0 300 70" className="absolute bottom-2 w-72">
        <ellipse cx="150" cy="26" rx="140" ry="20" fill="#1a1d27" stroke={SKY} strokeOpacity="0.35" />
        <path d="M10 26v14c0 11 63 20 140 20s140-9 140-20V26" fill="#13151d" />
        <ellipse cx="150" cy="26" rx="140" ry="20" fill="none" stroke={SKY} strokeWidth="2" className="ov-ring" />
      </svg>
      <div className="relative z-10 mb-9 w-64">
        <AnimatedCar id="podium-car" className="w-full" />
      </div>
      {/* progress ring + key */}
      <div className="ov-float absolute top-0 z-20 flex h-16 w-16 items-center justify-center ltr:right-4 rtl:left-4" style={{ animationDelay: '0.8s' }}>
        <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
          <circle cx="32" cy="32" r="27" fill="#11131A" stroke="white" strokeOpacity="0.1" strokeWidth="5" />
          <circle cx="32" cy="32" r="27" fill="none" stroke={SKY} strokeWidth="5" strokeLinecap="round" strokeDasharray="170" className="ov-progress" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke={SKY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative h-6 w-6">
          <circle cx="8" cy="15" r="4" />
          <path d="m10.85 12.15 7.4-7.4M18 5l2 2M15 8l2 2" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee strip                                                       */
/* ------------------------------------------------------------------ */

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[#7DE6EE]/10 bg-[#0d0f14] py-5" dir="ltr" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0d0f14] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0d0f14] to-transparent" />
      <div className="ov-marquee flex w-max items-center gap-10">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10">
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-10 text-lg font-bold whitespace-nowrap text-[#E6FAFC]/70 sm:text-xl">
                {item}
                <span className="ov-wordmark text-base">Ovfle</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

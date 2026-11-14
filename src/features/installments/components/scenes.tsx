/**
 * Ovfle illustrations: a realistic family sedan (original drawing, Camry-like
 * proportions, no third-party brand marks) driving through a night city, an aurora sky and a holographic phone.
 * Brand palette only: navy #11131A, sky #7DE6EE (+ deeper #3FC9D6), ice #E6FAFC, white.
 * All motion is CSS/SMIL (see installments.css) and is turned off under prefers-reduced-motion.
 */
import { BrandLogo, Icon } from './art';

const SKY = '#7DE6EE';
const DEEP = '#3FC9D6';
const ICE = '#E6FAFC';

/* ------------------------------------------------------------------ */
/* The car: a modern mid-size family sedan (Camry-like proportions,    */
/* no brand marks). It drives: wheels spin, body bobs. Nose → right.  */
/* ------------------------------------------------------------------ */

// Sedan silhouette: rear bumper → short trunk deck → rear window → long roof → raked windshield →
// hood → nose, then underside with real wheel arches (r=44 around wheel centres 140 and 470).
const BODY =
  'M44 166 C36 160 34 146 38 134 C40 122 46 112 60 108 L118 102 C140 100 150 96 160 90 C186 74 206 64 236 58 C270 52 330 52 360 56 C386 62 404 76 424 92 C460 96 500 100 530 106 C550 110 562 120 566 134 C568 148 564 160 556 166 L514 166 A44 44 0 0 0 426 166 L184 166 A44 44 0 0 0 96 166 Z';
// Glasshouse: rear window + rear quarter glass + rear door + front door glass.
const GLASS = 'M166 97 C192 79 212 69 240 64 C272 59 326 59 354 62 C376 65 394 77 410 94 Z';
const PILLARS = ['M222 66 L216 97', 'M302 60 L306 97'];
const DETAILS = [
  'M60 126 C200 118 380 116 552 126', // shoulder / character line
  'M214 100 C211 122 206 142 196 158', // rear door rear edge (follows the arch)
  'M304 100 L308 160', // B-pillar door cut
  'M410 98 C412 118 416 134 422 148', // front door front edge
  'M190 157 L420 157', // rocker
  'M60 108 C80 106 100 104 118 102', // trunk lid line
];

function Wheel({ cx, id }: { cx: number; id: string }) {
  const cy = 166;
  const spokes = [0, 72, 144, 216, 288];
  return (
    <g>
      {/* tyre */}
      <circle cx={cx} cy={cy} r="38" fill="#08090c" />
      <circle cx={cx} cy={cy} r="38" fill="none" stroke="#2a2f3b" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="33" fill="none" stroke="#14161d" strokeWidth="4" />
      {/* rim + brake disc */}
      <circle cx={cx} cy={cy} r="27" fill={`url(#${id}-rim)`} />
      <circle cx={cx} cy={cy} r="18" fill="#1a1d25" stroke="#3a4050" strokeWidth="1" />
      <path d={`M${cx - 6} ${cy - 17} a18 18 0 0 1 15 4 l-4 6 a11 11 0 0 0 -9 -2 z`} fill={DEEP} opacity="0.9" />
      {/* spinning double-spoke alloy */}
      <g className="ov-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {spokes.map((deg) => (
          <g key={deg} transform={`rotate(${deg} ${cx} ${cy})`}>
            <path d={`M${cx - 5} ${cy - 6} L${cx - 6} ${cy - 26} L${cx - 1.5} ${cy - 26} L${cx - 1} ${cy - 6} Z`} fill={`url(#${id}-spoke)`} />
            <path d={`M${cx + 1} ${cy - 6} L${cx + 1.5} ${cy - 26} L${cx + 6} ${cy - 26} L${cx + 5} ${cy - 6} Z`} fill={`url(#${id}-spoke)`} />
          </g>
        ))}
        <circle cx={cx} cy={cy} r="27" fill="none" stroke="#c9d3df" strokeOpacity="0.55" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="6" fill="#0d0f14" stroke="#9aa6b5" strokeWidth="1.5" />
        <circle cx={cx} cy={cy - 2} r="1.4" fill="#9aa6b5" />
      </g>
      {/* tyre highlight */}
      <path d={`M${cx - 30} ${cy - 22} A38 38 0 0 1 ${cx + 10} ${cy - 37}`} stroke="#ffffff" strokeOpacity="0.12" strokeWidth="2" fill="none" />
    </g>
  );
}

/** Realistic family sedan driving on a road (spinning wheels, moving lane marks). Original drawing. */
export function SedanCar({ id = 'car', className = '', road = true }: { id?: string; className?: string; road?: boolean }) {
  return (
    <svg viewBox="-30 -10 640 320" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#66728a" />
          <stop offset="0.28" stopColor="#323949" />
          <stop offset="0.55" stopColor="#151820" />
          <stop offset="0.8" stopColor="#232834" />
          <stop offset="1" stopColor="#090a0e" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.35" stopColor={ICE} stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.75" stopColor={SKY} stopOpacity="0.1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b3a48" />
          <stop offset="0.45" stopColor="#0e1219" />
          <stop offset="1" stopColor="#05070a" />
        </linearGradient>
        <linearGradient id={`${id}-glass-ref`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor={ICE} stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-rim`}>
          <stop offset="0" stopColor="#3b4250" />
          <stop offset="0.75" stopColor="#1b1f28" />
          <stop offset="1" stopColor="#5b6577" />
        </radialGradient>
        <linearGradient id={`${id}-spoke`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a96a6" />
          <stop offset="0.5" stopColor="#e3e9f0" />
          <stop offset="1" stopColor="#6f7a8a" />
        </linearGradient>
        <linearGradient id={`${id}-asphalt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2330" />
          <stop offset="1" stopColor="#11131A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-fadegrad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.15" stopColor="#fff" />
          <stop offset="0.85" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-fade`} maskUnits="userSpaceOnUse" x="-30" y="190" width="640" height="100">
          <rect x="-30" y="190" width="640" height="100" fill={`url(#${id}-fadegrad)`} />
        </mask>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={ICE} stopOpacity="0.22" />
          <stop offset="1" stopColor={ICE} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor="#000000" stopOpacity="0.7" />
          <stop offset="0.6" stopColor={SKY} stopOpacity="0.12" />
          <stop offset="1" stopColor={SKY} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`${id}-beamblur`} x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {road && (
        <g>
          {/* asphalt band fading at both ends */}
          <rect x="-30" y="204" width="640" height="70" fill={`url(#${id}-asphalt)`} mask={`url(#${id}-fade)`} />
          <path d="M-30 204.5 H610" stroke={SKY} strokeOpacity="0.45" strokeWidth="1.2" mask={`url(#${id}-fade)`} />
          {/* lane marks move backwards, so the car reads as driving forward */}
          <path
            d="M-30 240 H610"
            stroke={ICE}
            strokeOpacity="0.55"
            strokeWidth="3"
            strokeDasharray="36 28"
            className="ov-lane"
            style={{ animationDirection: 'reverse' }}
            mask={`url(#${id}-fade)`}
          />
        </g>
      )}

      {/* contact shadow */}
      <ellipse cx="300" cy="206" rx="270" ry="10" fill={`url(#${id}-shadow)`} />

      <g className="ov-bob">

        {/* headlight beam */}
        <path d="M556 124 L640 108 L640 150 Z" fill={`url(#${id}-beam)`} filter={`url(#${id}-beamblur)`} className="ov-beam" />

        {/* wheels sit behind the body edge */}
        <Wheel cx={140} id={id} />
        <Wheel cx={470} id={id} />

        {/* body */}
        <path d={BODY} fill={`url(#${id}-paint)`} />
        <g clipPath={`url(#${id}-clip)`}>
          <path d="M30 108 C200 98 400 100 580 114 L580 134 C400 120 200 120 30 132 Z" fill={`url(#${id}-sheen)`} />
          <rect x="30" y="146" width="560" height="24" fill="#000" opacity="0.35" />
        </g>

        {/* glass */}
        <path d={GLASS} fill={`url(#${id}-glass)`} />
        <path d="M232 90 C254 72 282 66 330 64 L284 96 Z" fill={`url(#${id}-glass-ref)`} opacity="0.65" />
        {PILLARS.map((d) => (
          <path key={d} d={d} stroke="#0a0c10" strokeWidth="7" strokeLinecap="round" />
        ))}
        <path d={GLASS} stroke="#2c3442" strokeWidth="1.5" />
        {/* chrome window trim */}
        <path d="M166 97 L410 94" stroke="#9aa6b5" strokeOpacity="0.5" strokeWidth="1.2" />

        {/* panel details */}
        <g stroke="#0a0c10" strokeWidth="1.4" strokeLinecap="round" opacity="0.9">
          {DETAILS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path d="M60 125 C200 117 380 115 552 125" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
        {/* door handles + mirror */}
        <rect x="236" y="111" width="20" height="4" rx="2" fill="#0a0c10" stroke="#5b6577" strokeWidth="0.8" />
        <rect x="334" y="111" width="20" height="4" rx="2" fill="#0a0c10" stroke="#5b6577" strokeWidth="0.8" />
        <path d="M398 92 C404 85 416 85 422 89 L420 98 L402 98 Z" fill="#1d212b" stroke="#3a4252" strokeWidth="1" />
        {/* lower front intake + side marker */}
        <path d="M538 152 L560 150" stroke="#0a0c10" strokeWidth="3" strokeLinecap="round" />

        {/* lights: swept-back headlight, wrap-around taillight */}
        <path d="M518 108 C536 110 552 116 562 126 L548 129 C538 121 526 117 512 115 Z" fill="#ffffff" className="ov-headlight" />
        <path d="M518 108 C536 110 552 116 562 126" stroke={SKY} strokeWidth="2" filter={`url(#${id}-soft)`} />
        <path d="M40 116 L74 110 L78 118 L44 126 Z" fill={DEEP} className="ov-headlight" style={{ animationDelay: '-0.6s' }} />

        {/* top-edge rim light */}
        <path
          d="M118 102 C140 100 150 96 160 90 C186 74 206 64 236 58 C270 52 330 52 360 56 C386 62 404 76 424 92 C460 96 500 100 530 106"
          stroke={SKY}
          strokeOpacity="0.75"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M206 64 C236 58 270 52 330 52" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Sky backdrop: gradient, stars, aurora, two skylines, sky lanes      */
/* ------------------------------------------------------------------ */

// Deterministic pseudo-random values so server and client markup match.
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: rand(i + 1) * 100,
  y: rand(i + 101) * 62,
  r: 0.6 + rand(i + 201) * 1.4,
  d: rand(i + 301) * 5,
}));

function skyline(seed: number, count: number, minH: number, maxH: number) {
  let x = 0;
  return Array.from({ length: count }, (_, i) => {
    const w = 30 + rand(seed + i) * 46;
    const h = minH + rand(seed + i + 50) * (maxH - minH);
    const b = { x, w, h, spire: rand(seed + i + 90) > 0.78 };
    x += w + 4;
    return b;
  });
}
const FAR = skyline(7, 30, 60, 170);
const NEAR = skyline(61, 24, 90, 260);

function City({ buildings, base, fill, stroke, windows, className }: { buildings: ReturnType<typeof skyline>; base: number; fill: string; stroke: number; windows: boolean; className: string }) {
  return (
    <svg viewBox={`0 0 1400 ${base}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {buildings.map((b, i) => (
        <g key={i}>
          {b.spire && <path d={`M${b.x + b.w / 2} ${base - b.h - 34}V${base - b.h}`} stroke={SKY} strokeOpacity={stroke * 2} />}
          {b.spire && <circle cx={b.x + b.w / 2} cy={base - b.h - 34} r="2.2" fill={SKY} className="ov-beacon" style={{ animationDelay: `${(i % 5) * 0.4}s` }} />}
          <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill={fill} stroke={SKY} strokeOpacity={stroke} />
          {windows &&
            Array.from({ length: Math.floor((b.h - 16) / 16) }, (_, row) =>
              Array.from({ length: Math.floor((b.w - 8) / 11) }, (_, col) => {
                const s = rand(i * 97 + row * 13 + col * 7);
                if (s > 0.28) return null;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={b.x + 6 + col * 11}
                    y={base - b.h + 10 + row * 16}
                    width="4"
                    height="6"
                    fill={s < 0.1 ? ICE : SKY}
                    className="ov-window"
                    style={{ animationDelay: `${s * 12}s`, opacity: 0.3 + s * 2 }}
                  />
                );
              }),
            )}
        </g>
      ))}
    </svg>
  );
}

/** Full-bleed hero background. Layers read --px/--py (set by <Parallax>) for depth. */
export function SkyBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#16202e_0%,#11131A_55%,#0b0d12_100%)]" />
      {/* aurora ribbons */}
      <div className="ov-aurora absolute -top-24 left-[-10%] h-72 w-[70%] rounded-[50%] bg-[linear-gradient(90deg,transparent,rgb(125_230_238/0.35),rgb(230_250_252/0.15),transparent)] blur-3xl" />
      <div className="ov-aurora absolute top-10 right-[-15%] h-60 w-[60%] rounded-[50%] bg-[linear-gradient(90deg,transparent,rgb(63_201_214/0.3),transparent)] blur-3xl" style={{ animationDelay: '-6s' }} />
      {/* stars */}
      <div className="ov-layer absolute inset-0" style={{ ['--depth' as string]: '6' }}>
        {STARS.map((s, i) => (
          <span
            key={i}
            className="ov-star absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, animationDelay: `${s.d}s` }}
          />
        ))}
      </div>
      {/* skylines */}
      <div className="ov-layer absolute inset-x-[-4%] bottom-0" style={{ ['--depth' as string]: '14' }}>
        <City buildings={FAR} base={240} fill="#141822" stroke={0.08} windows={false} className="h-[30vh] min-h-48 w-full opacity-70" />
      </div>
      <div className="ov-layer absolute inset-x-[-6%] bottom-0" style={{ ['--depth' as string]: '26' }}>
        <City buildings={NEAR} base={320} fill="#0f1219" stroke={0.14} windows className="h-[34vh] min-h-52 w-full" />
      </div>
      {/* readability: darken behind the text column */}
      <div className="absolute inset-0 from-(--ov-surface-2)/90 via-(--ov-surface-2)/40 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
      {/* horizon haze + bottom fade into the next section */}
      <div className="absolute inset-x-0 bottom-[10%] h-64 bg-[radial-gradient(55%_50%_at_50%_50%,rgb(125_230_238/0.14),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_top,#11131A_0%,rgb(17_19_26/0.85)_30%,rgb(17_19_26/0)_100%)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic phone: shows the application journey, never an offer   */
/* ------------------------------------------------------------------ */

export interface StatusLabels {
  title: string;
  received: string;
  review: string;
  result: string;
}

export function HoloPhone({ labels, className = '' }: { labels: StatusLabels; className?: string }) {
  const rows = [
    { label: labels.received, state: 'done' as const },
    { label: labels.review, state: 'active' as const },
    { label: labels.result, state: 'todo' as const },
  ];
  return (
    <div className={`ov-holo relative w-48 rounded-[2rem] border border-(--ov-accent)/40 bg-(--ov-surface)/60 p-2 backdrop-blur-md ${className}`}>
      <div className="ov-scan relative overflow-hidden rounded-[1.6rem] border border-(--ov-tint)/10 bg-gradient-to-b from-(--ov-accent)/10 to-transparent px-4 pt-6 pb-4">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-(--ov-tint)/20" />
        <BrandLogo className="text-xl" />
        <div className="mt-4 text-[11px] font-bold text-(--ov-fg)">{labels.title}</div>
        <ol className="mt-3 space-y-2.5">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  row.state === 'done' ? 'bg-[#7DE6EE] text-[#11131A]' : row.state === 'active' ? 'ov-dot-active border border-(--ov-accent) text-(--ov-accent)' : 'border border-(--ov-tint)/20 text-(--ov-fg)/30'
                }`}
              >
                {row.state === 'done' ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              <span className={`text-[10px] font-bold ${row.state === 'todo' ? 'text-(--ov-fg)/35' : 'text-(--ov-ink)'}`}>{row.label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-(--ov-tint)/10">
          <span className="ov-progress-bar block h-full rounded-full bg-gradient-to-r from-(--ov-accent) to-(--ov-ink)" />
        </div>
      </div>
      <div className="absolute -bottom-10 left-1/2 h-12 w-28 -translate-x-1/2 bg-[radial-gradient(50%_100%_at_50%_0%,rgb(125_230_238/0.45),transparent)] blur-sm" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero showcase art: one panel per service, same size and weight      */
/* ------------------------------------------------------------------ */

/** Car side of the hero: the sedan driving on a lit road with speed lines. */
export function CarShowcaseArt() {
  return (
    <div className="relative h-56 w-full overflow-hidden sm:h-64" aria-hidden="true">
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(55%_100%_at_50%_100%,rgb(125_230_238/0.2),transparent)]" />
      <div className="absolute top-[38%] left-0 w-1/2 space-y-3" dir="ltr">
        {[70, 40, 90, 55].map((w, i) => (
          <span
            key={i}
            className="ov-speed block h-px bg-gradient-to-l from-(--ov-accent)/70 to-transparent"
            style={{ width: `${w}%`, animationDelay: `${i * 0.3}s`, marginLeft: `${(i * 17) % 40}%` }}
          />
        ))}
      </div>
      <div className="ov-layer absolute inset-x-[3%] bottom-[-2%]" style={{ ['--depth' as string]: '-14' }}>
        <div className="ov-drive-in">
          <SedanCar id="hero-car" className="w-full drop-shadow-[0_24px_30px_rgb(0_0_0/0.6)]" />
        </div>
      </div>
    </div>
  );
}

/** Smartphone side of the hero: the holographic phone with orbit rings. */
export function PhoneShowcaseArt({ labels }: { labels: StatusLabels }) {
  return (
    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden sm:h-64" aria-hidden="true">
      <div className="absolute h-48 w-48 rounded-full bg-(--ov-accent)/15 blur-3xl" />
      <svg viewBox="0 0 220 220" className="ov-spin-slow absolute h-60 w-60">
        <circle cx="110" cy="110" r="100" fill="none" stroke={SKY} strokeOpacity="0.25" strokeDasharray="2 8" />
        <circle cx="110" cy="10" r="4" fill={SKY} />
        <circle cx="210" cy="110" r="3" fill={ICE} />
      </svg>
      <svg viewBox="0 0 220 220" className="ov-spin-rev absolute h-44 w-44">
        <circle cx="110" cy="110" r="100" fill="none" stroke={DEEP} strokeOpacity="0.4" strokeDasharray="40 30" />
      </svg>
      <div className="ov-layer relative z-10" style={{ ['--depth' as string]: '-14' }}>
        <div className="ov-pop-in" style={{ animationDelay: '0.5s' }}>
          <div className="ov-float">
            <HoloPhone labels={labels} className="origin-center scale-[0.78] sm:scale-[0.86]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Journey path for "how it works" (a light travels through 3 steps)  */
/* ------------------------------------------------------------------ */

export function JourneyPath() {
  return (
    <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 -top-6 hidden h-32 w-full md:block" aria-hidden="true">
      <defs>
        <linearGradient id="ov-path-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SKY} stopOpacity="0.1" />
          <stop offset="0.5" stopColor={SKY} stopOpacity="0.7" />
          <stop offset="1" stopColor={SKY} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path id="ov-journey" d="M60 90 C 220 -10, 340 -10, 500 60 S 800 130, 940 30" stroke="url(#ov-path-grad)" strokeWidth="1.5" strokeDasharray="4 8" fill="none" className="ov-path-draw" />
      <g className="ov-lane-dot">
        <circle r="4" style={{ fill: 'var(--ov-fg)' }} />
        <circle r="14" fill={SKY} opacity="0.3" />
        <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
          <mpath href="#ov-journey" />
        </animateMotion>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee strip                                                       */
/* ------------------------------------------------------------------ */

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-(--ov-accent)/10 bg-(--ov-surface-2) py-5" dir="ltr" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-(--ov-surface-2) to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-(--ov-surface-2) to-transparent" />
      <div className="ov-marquee flex w-max items-center gap-10">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10">
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-10 text-lg font-bold whitespace-nowrap text-(--ov-ink)/70 sm:text-xl">
                {item}
                <BrandLogo className="text-base opacity-80" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Ovfle illustrations and icons (hand-drawn SVG in the brand palette). */

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`ov-wordmark ${className}`} dir="ltr">
      Ovfle
    </span>
  );
}

type IconName = 'phone' | 'car' | 'id' | 'wallet' | 'briefcase' | 'contact' | 'arrow' | 'check' | 'search' | 'spark' | 'x' | 'clock';

const ICONS: Record<IconName, string> = {
  phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  car: 'M5 17h-1a1 1 0 0 1-1-1v-3.2a2 2 0 0 1 .6-1.4L6 9l1.6-3.2A2 2 0 0 1 9.4 4.7h5.2a2 2 0 0 1 1.8 1.1L18 9l2.4 2.4a2 2 0 0 1 .6 1.4V16a1 1 0 0 1-1 1h-1M9 17h6M6 9h12M7.5 17a1.5 1.5 0 1 0 0 .01M16.5 17a1.5 1.5 0 1 0 0 .01',
  id: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 10a2 2 0 1 0 0 .01M6.5 16a3 3 0 0 1 5 0M14 9h4M14 13h3',
  wallet: 'M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M21 11h-5a2 2 0 0 0 0 4h5zM3 7h16',
  briefcase: 'M9 6V4h6v2M4 6h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1zM3 12h18',
  contact: 'M4 6h16v12H4zM4 7l8 6 8-6',
  arrow: 'M19 12H5M12 5l-7 7 7 7',
  check: 'M20 6 9 17l-5-5',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  spark: 'M13 2 4 14h7l-1 8 9-12h-7z',
  x: 'M6 6l12 12M18 6 6 18',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
};

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

/** Arrow that points "forward" in both directions (RTL flips it). */
export function ForwardArrow({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`${className} ltr:rotate-180`} aria-hidden="true">
      <path d={ICONS.arrow} />
    </svg>
  );
}

/** Side-profile sedan in glowing outline. */
export function CarArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 430 200" fill="none" className={className} aria-hidden="true">
      <defs>
        <filter id="ov-car-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ov-car-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DE6EE" stopOpacity="0.16" />
          <stop offset="1" stopColor="#7DE6EE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="216" cy="188" rx="200" ry="7" fill="#7DE6EE" opacity="0.18" />
      <path
        d="M18 158V146c0-12 10-20 28-23l58-9c22-22 48-36 82-38h76c30 0 52 12 78 36l40 6c20 3 32 14 34 30v10c0 6-4 10-10 10h-22a30 30 0 0 0-60 0H128a30 30 0 0 0-60 0H28c-6 0-10-4-10-10z"
        fill="url(#ov-car-fill)"
      />
      <g stroke="#7DE6EE" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" filter="url(#ov-car-glow)" className="ov-draw">
        <path d="M18 158V146c0-12 10-20 28-23l58-9c22-22 48-36 82-38h76c30 0 52 12 78 36l40 6c20 3 32 14 34 30v10c0 6-4 10-10 10h-22a30 30 0 0 0-60 0H128a30 30 0 0 0-60 0H28c-6 0-10-4-10-10z" />
        <path d="M118 114c20-18 42-26 68-27h36v27zM232 87h30c22 0 38 9 56 27h-86z" />
        <path d="M196 132h16M300 128h26M40 140h18" />
        <circle cx="98" cy="168" r="22" />
        <circle cx="98" cy="168" r="8" />
        <circle cx="352" cy="168" r="22" />
        <circle cx="352" cy="168" r="8" />
      </g>
    </svg>
  );
}

/** Phone mockup whose screen shows an installment plan (12 monthly bars, some paid). */
export function PhoneArt({ title, caption, months, className = '' }: { title: string; caption: string; months: string; className?: string }) {
  const bars = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className={`relative ${className}`}>
      <div className="relative mx-auto h-[23rem] w-[11.5rem] rounded-[2.4rem] border border-white/15 bg-[#0b0d13] p-2.5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] ov-neon">
        <div className="absolute top-3 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
        <div className="ov-texture flex h-full flex-col rounded-[1.9rem] bg-gradient-to-b from-[#171a24] to-[#0f1118] px-4 pt-10 pb-4">
          <Wordmark className="text-2xl" />
          <div className="mt-5 rounded-2xl border border-[#7DE6EE]/25 bg-white/[0.04] p-3">
            <div className="text-[11px] font-bold text-[#E6FAFC]/70">{title}</div>
            <div className="mt-1 flex items-baseline gap-1.5" dir="ltr">
              <span className="text-3xl font-semibold text-[#7DE6EE]">12</span>
              <span className="text-xs text-[#E6FAFC]/60">{months}</span>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5" dir="ltr">
              {bars.map((i) => (
                <span
                  key={i}
                  className={`ov-bar h-6 rounded-md ${i < 5 ? 'bg-[#7DE6EE]' : 'bg-white/10'}`}
                  style={{ animationDelay: `${0.6 + i * 0.08}s` }}
                />
              ))}
            </div>
            <div className="mt-2 text-[10px] text-[#E6FAFC]/50">{caption}</div>
          </div>
          <div className="mt-auto flex items-center justify-between rounded-xl bg-[#7DE6EE] px-3 py-2.5 text-[#11131A]">
            <Icon name="spark" className="h-4 w-4" />
            <span className="h-1.5 w-16 rounded-full bg-[#11131A]/25" />
            <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
          </div>
        </div>
      </div>
    </div>
  );
}

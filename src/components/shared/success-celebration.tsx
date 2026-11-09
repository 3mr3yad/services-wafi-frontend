import type { CSSProperties, ReactNode } from 'react';
import './success-celebration.css';

const SPARK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** Animated success badge: the circle draws itself, fills, the check is drawn, then rings + sparks burst out. */
export function SuccessMark({ accent, ink = '#ffffff', size = 88 }: { accent: string; ink?: string; size?: number }) {
  return (
    <span className="sc-mark" style={{ '--sc-accent': accent, '--sc-ink': ink, '--sc-size': `${size}px` } as CSSProperties} aria-hidden="true">
      <span className="sc-ring" />
      <span className="sc-ring" />
      {SPARK_ANGLES.map((angle) => (
        <span key={angle} className="sc-spark" style={{ '--a': `${angle}deg` } as CSSProperties} />
      ))}
      <svg viewBox="0 0 52 52" className="sc-mark-pop">
        <circle className="sc-circle" cx="26" cy="26" r="25" />
        <circle className="sc-disc" cx="26" cy="26" r="25" />
        <path className="sc-check" d="M15 27l7 7 15-16" />
      </svg>
    </span>
  );
}

/** The request number, revealed character by character after the check mark. */
export function RevealNumber({ value, className = '' }: { value: string; className?: string }) {
  return (
    <span className={className} dir="ltr" aria-label={value}>
      {[...value].map((char, index) => (
        <span key={index} className="sc-digit" style={{ '--i': index } as CSSProperties} aria-hidden="true">
          {char}
        </span>
      ))}
    </span>
  );
}

/** Wraps content that should fade in after the number (`delay` in seconds). */
export function AfterReveal({ delay = 1.1, className = '', children }: { delay?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`sc-after ${className}`} style={{ '--d': `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

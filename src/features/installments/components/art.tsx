'use client';

import { AnimateIcon, type IconProps } from '@animate-ui/react/icons';
import { MotionConfig } from 'motion/react';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left';
import { Check } from '@/components/animate-ui/icons/check';
import { Clock } from '@/components/animate-ui/icons/clock';
import { House } from '@/components/animate-ui/icons/house';
import { Mail } from '@/components/animate-ui/icons/mail';
import { Search } from '@/components/animate-ui/icons/search';
import { ShieldCheck } from '@/components/animate-ui/icons/shield-check';
import { Smartphone } from '@/components/animate-ui/icons/smartphone';
import { Sparkles } from '@/components/animate-ui/icons/sparkles';
import { Wallet } from '@/components/animate-ui/icons/wallet';
import { X } from '@/components/animate-ui/icons/x';
import { BRAND } from '../brand';

/** Ovfle logo + icons. Animated icons come from animate-ui (Lucide set); car / id / briefcase have no animate-ui version. */

type IconName = 'home' | 'phone' | 'car' | 'id' | 'wallet' | 'briefcase' | 'contact' | 'arrow' | 'check' | 'search' | 'spark' | 'x' | 'clock' | 'shield';

const ANIMATED: Partial<Record<IconName, ComponentType<IconProps<"default">>>> = {
  phone: Smartphone,
  wallet: Wallet,
  contact: Mail,
  check: Check,
  search: Search,
  spark: Sparkles,
  home: House,
  x: X,
  clock: Clock,
  shield: ShieldCheck,
};

const STATIC: Record<'car' | 'id' | 'briefcase', string> = {
  car: 'M5 17h-1a1 1 0 0 1-1-1v-3.2a2 2 0 0 1 .6-1.4L6 9l1.6-3.2A2 2 0 0 1 9.4 4.7h5.2a2 2 0 0 1 1.8 1.1L18 9l2.4 2.4a2 2 0 0 1 .6 1.4V16a1 1 0 0 1-1 1h-1M9 17h6M6 9h12M7.5 17a1.5 1.5 0 1 0 0 .01M16.5 17a1.5 1.5 0 1 0 0 .01',
  id: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 10a2 2 0 1 0 0 .01M6.5 16a3 3 0 0 1 5 0M14 9h4M14 13h3',
  briefcase: 'M9 6V4h6v2M4 6h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1zM3 12h18',
};

/**
 * Brand icon. Animated ones play when they scroll into view and on hover
 * (or when their parent <HoverIcons> / OpenButton is hovered). `loop` keeps them moving.
 */
export function Icon({
  name,
  className = 'h-5 w-5',
  strokeWidth = 1.8,
  loop,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  loop?: boolean;
}) {
  const Animated = ANIMATED[name];
  if (Animated) {
    return (
      <Animated
        className={className}
        strokeWidth={strokeWidth}
        aria-hidden="true"
        animateOnView
        animateOnHover
        {...(loop ? { loop: true, loopDelay: 1800 } : {})}
      />
    );
  }
  const path = name === 'arrow' ? 'M19 12H5M12 5l-7 7 7 7' : STATIC[name as keyof typeof STATIC];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={`ov-static-icon ${className}`} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/** Arrow that points "forward" in both directions (RTL: left; LTR: flipped to the right). */
export function ForwardArrow({ className = 'h-4 w-4' }: { className?: string }) {
  return <ArrowLeft className={`${className} ltr:rotate-180`} strokeWidth={2.2} aria-hidden="true" />;
}

/** Plays every animated icon inside `children` while the element is hovered. */
export function HoverIcons({ children }: { children: ReactElement }) {
  return (
    <AnimateIcon animateOnHover asChild>
      {children}
    </AnimateIcon>
  );
}

/** Honours the OS "reduce motion" setting for every motion-driven icon on the page. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Official Ovfle logo: the wordmark from the brand book (Poppins Rounded style, sky blue on navy). */
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`ov-brandname ${className}`} dir="ltr" translate="no">
      {BRAND.wordmark}
    </span>
  );
}

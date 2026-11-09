'use client';

import { useEffect, useRef, useState } from 'react';

/** Full-screen logo loader with a fake progress count; slides up when done. */
export function Preloader({ logo }: { logo: string }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Like the original "reset-scroll" script: always start at the top.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = window.setTimeout(() => {
        setProgress(100);
        setDone(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    let value = 0;
    let doneTimer = 0;
    const interval = window.setInterval(() => {
      value += Math.floor(Math.random() * 9) + 3;
      if (value >= 100) {
        value = 100;
        window.clearInterval(interval);
        doneTimer = window.setTimeout(() => setDone(true), 400);
      }
      setProgress(value);
    }, 85);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div className={'preloader' + (done ? ' is-done' : '')} aria-hidden="true">
      <span className="preloader__glow" />
      <img className="preloader__logo" src={logo} alt="" width={260} height={58} />
      <div className="preloader__meta">
        <div className="preloader__bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="preloader__count" dir="ltr">
          <span>{progress}</span>
          <i>%</i>
        </div>
      </div>
    </div>
  );
}

/** Custom ring + dot cursor (pointer devices only). */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${targetX}px,${targetY}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      if (ring.current) ring.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      frame = requestAnimationFrame(loop);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      ring.current?.classList.toggle('is-active', Boolean(target?.closest?.('a,button,[data-magnetic],[data-tilt]')));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  );
}

/** Top progress bar following the page scroll, with a light spring (stiffness 120, damping 30, mass 0.3). */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let value = 0;
    let velocity = 0;
    let frame = 0;
    let last = performance.now();
    const target = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const step = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000);
      last = now;
      const goal = target();
      // Semi-implicit Euler spring integration, sub-stepped for stability.
      for (let i = 0; i < 4; i++) {
        const h = dt / 4;
        const force = 120 * (goal - value) - 30 * velocity;
        velocity += (force / 0.3) * h;
        value += velocity * h;
      }
      if (Math.abs(goal - value) < 0.0005 && Math.abs(velocity) < 0.001) {
        value = goal;
        velocity = 0;
      }
      if (bar.current) bar.current.style.transform = `scaleX(${value})`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div className="scroll-progress" ref={bar} aria-hidden="true" style={{ transform: 'scaleX(0)' }} />;
}

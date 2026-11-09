'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Reveal, usePresence, useReveal } from './motion';
import type { CssVars } from './motion';

export interface VideoItem {
  title: string;
  duration: string;
  thumb: string;
  src: string;
}

interface VideosProps {
  items: VideoItem[];
  kicker: string;
  title: string;
  nextLabel: string;
  prevLabel: string;
  showLabels: string[];
  closeLabel: string;
}

function VideoCard({
  video,
  index,
  onPlay,
  setCardEl,
}: {
  video: VideoItem;
  index: number;
  onPlay: (video: VideoItem) => void;
  setCardEl: (el: HTMLAnchorElement | null) => void;
}) {
  const [ref, inView] = useReveal<HTMLAnchorElement>();
  return (
    <a
      ref={(el) => {
        ref.current = el;
        setCardEl(el);
      }}
      href="#"
      draggable={false}
      className={'vcard r' + (inView ? ' in' : '')}
      style={{ '--d': `${index * 0.07}s` } as CssVars}
      onClick={(e) => {
        if (video.src) {
          e.preventDefault();
          onPlay(video);
        }
      }}
    >
      <div className="vcard__media">
        <img
          alt={video.title}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="vcard__img"
          style={{ position: 'absolute', height: '100%', width: '100%', inset: 0, color: 'transparent' }}
          src={video.thumb}
        />
        <span className="vcard__play">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
        <span className="vcard__duration">{video.duration}</span>
      </div>
      <div className="vcard__foot">
        <h3 className="vcard__title">{video.title}</h3>
        <span className="vcard__arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </a>
  );
}

/** Draggable, snap-scrolling video strip with arrows/dots and a lightbox player. */
export function Videos({ items, kicker, title, nextLabel, prevLabel, showLabels, closeLabel }: VideosProps) {
  const [playing, setPlaying] = useState<VideoItem | null>(null);
  const [lastPlayed, setLastPlayed] = useState<VideoItem | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const programmatic = useRef(false);
  const releaseTimer = useRef<number | undefined>(undefined);
  const lightbox = usePresence(playing !== null);
  const shown = playing ?? lastPlayed;

  const play = (video: VideoItem) => {
    setLastPlayed(video);
    setPlaying(video);
  };

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlaying(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Track which card is in view while the strip is scrolled by hand.
  useEffect(() => {
    const root = track.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (programmatic.current) return;
        const visible = entries
          .map((entry) => ({ idx: cards.current.indexOf(entry.target as HTMLAnchorElement), ratio: entry.intersectionRatio }))
          .filter((v) => v.idx !== -1 && v.ratio > 0.5);
        if (visible.length) setActive(Math.min(...visible.map((v) => v.idx)));
      },
      { root, threshold: [0.25, 0.5, 0.75, 1] },
    );
    cards.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const goTo = useCallback(
    (target: number) => {
      const index = Math.max(0, Math.min(items.length - 1, target));
      const root = track.current;
      const card = cards.current[index];
      if (!root || !card) return;
      programmatic.current = true;
      setActive(index);
      card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      window.clearTimeout(releaseTimer.current);
      const release = () => {
        programmatic.current = false;
        root.removeEventListener('scrollend', release);
      };
      root.addEventListener('scrollend', release, { once: true });
      releaseTimer.current = window.setTimeout(release, 1000);
    },
    [items.length],
  );

  // Mouse drag-to-scroll with snapping to the nearest card.
  useEffect(() => {
    const root = track.current;
    if (!root) return;
    let startX = 0;
    let startScroll = 0;
    let delta = 0;
    let dragging = false;
    let moved = false;
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const d = e.clientX - startX;
      delta = d;
      if (Math.abs(d) > 4) moved = true;
      root.scrollLeft = startScroll + d;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!moved) return;
      const swallow = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
      };
      window.addEventListener('click', swallow, { capture: true, once: true });
      window.setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 150);
      const width = cards.current[0]?.getBoundingClientRect().width ?? 300;
      if (Math.abs(delta) > width / 4) goTo(activeRef.current + (delta < 0 ? 1 : -1));
      else goTo(activeRef.current);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = root.scrollLeft;
      root.classList.add('is-dragging');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };
    root.addEventListener('pointerdown', onDown);
    return () => {
      root.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [goTo]);

  return (
    <section className="section videos" id="videos">
      <div className="videos__head">
        <div>
          <Reveal as="p" className="section-kicker">
            <i />
            {kicker}
          </Reveal>
          <Reveal as="h2" className="videos__title" delay={0.05}>
            {title}
          </Reveal>
        </div>
        <div className="videos__nav">
          <button type="button" className="products__arrow" onClick={() => goTo(active + 1)} disabled={active === items.length - 1} aria-label={nextLabel}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="products__arrow" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={prevLabel}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="videos__track" ref={track}>
        {items.map((video, i) => (
          <VideoCard
            key={video.title}
            video={video}
            index={i}
            onPlay={play}
            setCardEl={(el) => {
              cards.current[i] = el;
            }}
          />
        ))}
      </div>
      <div className="products__foot">
        <div className="products__dots">
          {items.map((video, i) => (
            <button
              key={video.title}
              type="button"
              className={'products__dot' + (i === active ? ' is-active' : '')}
              onClick={() => goTo(i)}
              aria-label={showLabels[i]}
            />
          ))}
        </div>
      </div>
      {lightbox.mounted && shown ? (
        <>
          <div className={'vlightbox__backdrop wp-fade' + (lightbox.leaving ? ' is-leaving' : '')} onClick={() => setPlaying(null)} />
          <div className="vlightbox__wrap">
            <div className={'vlightbox__panel wp-pop' + (lightbox.leaving ? ' is-leaving' : '')}>
              <button type="button" className="vlightbox__close" onClick={() => setPlaying(null)} aria-label={closeLabel}>
                ×
              </button>
              <video className="vlightbox__video" src={shown.src} controls autoPlay playsInline poster={shown.thumb} />
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { Link } from '@/i18n/navigation';
import { Icon } from './icon-sprite';

interface HomeHeaderProps {
  labels: {
    home: string;
    services: string;
    protection: string;
    how: string;
    trackNow: string;
    switchLanguage: string;
  };
}

const SPY_TARGETS = ['home', 'services', 'how'] as const;

/** Homepage header: mobile menu toggle + scroll-spy, same behaviour as home.blade.php. */
export function HomeHeader({ labels }: HomeHeaderProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.35 },
    );
    SPY_TARGETS.map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .forEach((el) => spy.observe(el));
    return () => spy.disconnect();
  }, []);

  const close = () => setOpen(false);
  const navClass = (target: string) => (active === target ? 'is-active' : undefined);

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand" aria-label="عالم وافي - الرئيسية">
          <img src="/images/logo.png" alt="" />
        </Link>
        <nav className={`nav${open ? ' open' : ''}`} id="mainNav" aria-label="القائمة الرئيسية">
          <Link href="/" className={navClass('home')} onClick={close}>
            {labels.home}
          </Link>
          <Link href="/#services" className={navClass('services')} onClick={close}>
            {labels.services}
          </Link>
          <Link href="/services/protection" onClick={close}>
            {labels.protection}
          </Link>
          <Link href="/#how" className={navClass('how')} onClick={close}>
            {labels.how}
          </Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="#tracker" className="header-track">
            <Icon name="search" />
            <span>{labels.trackNow}</span>
          </a>
          <LocaleSwitcher label={labels.switchLanguage} targetName={labels.switchLanguage} className="lang-switch" />
          <button
            type="button"
            className="menu-toggle"
            aria-label="فتح القائمة"
            aria-expanded={open}
            aria-controls="mainNav"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>
    </header>
  );
}

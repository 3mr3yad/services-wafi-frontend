'use client';

import { useEffect, useState } from 'react';
import { useFormDockEvent, usePresence } from './motion';

interface FormDockProps {
  /** Toggle label ("سجّل ضمان منتجك"). */
  label: string;
  /** Panel title shown in the window bar and used as the iframe title. */
  title: string;
  /** Page embedded in the panel (the X-Leader warranty form, with ?embed=1). */
  src: string;
  closeFormLabel: string;
  closeLabel: string;
}

/**
 * Floating "register your warranty" button. Opens a panel that embeds the warranty form page in an iframe.
 * The original supported several services with a chooser; this page only ever passes one, so the iframe opens directly.
 */
export function FormDock({ label, title, src, closeFormLabel, closeLabel }: FormDockProps) {
  const [open, setOpen] = useState(false);
  const [settled, setSettled] = useState(false);
  const presence = usePresence(open);

  useFormDockEvent(() => {
    setOpen(true);
    setSettled(true);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggle = () => {
    setOpen((value) => !value);
    setSettled(true);
  };

  return (
    <>
      <button
        type="button"
        className={'dock__toggle' + (open ? ' is-open' : '') + (settled ? ' is-settled' : '')}
        onClick={toggle}
        aria-expanded={open}
        aria-controls="formDockPanel"
      >
        <span className="dock__toggle-icon" aria-hidden="true">
          <i />
          <i />
        </span>
        <span className="dock__toggle-label">{open ? closeFormLabel : label}</span>
      </button>
      {presence.mounted ? (
        <>
          <div className={'dock__backdrop wp-fade' + (presence.leaving ? ' is-leaving' : '')} onClick={() => setOpen(false)} />
          <div className="dock__panel-wrap">
            <div
              className={'dock__panel wp-pop' + (presence.leaving ? ' is-leaving' : '')}
              id="formDockPanel"
              role="complementary"
              aria-label={title}
            >
              <div className="dock__bar">
                <span className="dock__dot" />
                <span className="dock__dot" />
                <span className="dock__dot" />
                <b>{title}</b>
                <button type="button" className="dock__close" onClick={() => setOpen(false)} aria-label={closeLabel}>
                  ×
                </button>
              </div>
              <iframe className="dock__frame" src={src} title={title} />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

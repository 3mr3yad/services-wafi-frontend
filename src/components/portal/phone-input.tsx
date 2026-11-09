'use client';

import 'intl-tel-input/styles';
import type { Iti, SomeOptions } from 'intl-tel-input';
import { type Ref, useEffect, useImperativeHandle, useRef } from 'react';

export interface PhoneInputHandle {
  /** Validates the number. Shows/hides the error element. Returns the E.164 number, or null when invalid. */
  validate: () => Promise<string | null>;
  focus: () => void;
}

interface PhoneInputProps {
  /** Form field name. The submitted value is always the full E.164 number (e.g. +9665xxxxxxxx). */
  name: string;
  id: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  /** Element shown when the number is invalid (same as $errorId in the old intl-phone-init partial). */
  errorId?: string;
  /**
   * Render the country dropdown on <body> (position: fixed) instead of inside the field, so it's never
   * clipped by an overflow-hidden card/section or a scrolling dialog and doesn't inherit dark-theme colors.
   * Default true, like the old site (dropdownParent: document.body on every page).
   */
  dropdownInBody?: boolean;
  /** Localize country names (Intl.DisplayNames) and the dropdown UI (search, aria labels). Default: English, like the old site. */
  locale?: 'ar' | 'en';
  ref?: Ref<PhoneInputHandle>;
}

/**
 * Any-country phone input with a flag / dial-code picker (intl-tel-input 29.5.5, as on the old site),
 * Saudi Arabia by default. Ported from partials/public/intl-phone-init.blade.php.
 * The utils script is bundled from npm instead of loaded from a CDN.
 */
export function PhoneInput({ name, id, className, placeholder, required, defaultValue, errorId, dropdownInBody = true, locale, ref }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<Iti | null>(null);

  useEffect(() => {
    let cancelled = false;
    let instance: Iti | null = null;
    const uiTranslations = locale === 'ar' ? // The runtime module default-exports the translations (its .d.ts only declares named exports).
          import('intl-tel-input/locale/ar').then((m) => (m as unknown as { default: SomeOptions['uiTranslations'] }).default) : Promise.resolve(undefined);
    void Promise.all([import('intl-tel-input'), uiTranslations]).then(([{ default: intlTelInput }, translations]) => {
      if (cancelled || !inputRef.current) return;
      instance = intlTelInput(inputRef.current, {
        initialCountry: 'sa',
        separateDialCode: true,
        loadUtils: () => import('intl-tel-input/utils'),
        ...(dropdownInBody ? { dropdownParent: document.body } : {}),
        ...(locale ? { countryNameLocale: locale } : {}),
        ...(translations ? { uiTranslations: translations } : {}),
      });
      itiRef.current = instance;
    });
    return () => {
      cancelled = true;
      instance?.destroy();
      itiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intl-tel-input is initialised once per mount.
  }, []);

  const sync = () => {
    const iti = itiRef.current;
    if (hiddenRef.current) hiddenRef.current.value = iti?.getNumber() || inputRef.current?.value || '';
  };

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const iti = itiRef.current;
      const errorBox = errorId ? document.getElementById(errorId) : null;
      if (iti) await iti.promise;
      const valid = iti ? iti.isValidNumber() === true : Boolean(inputRef.current?.value);
      if (!valid) {
        errorBox?.classList.remove('hidden');
        inputRef.current?.focus();
        return null;
      }
      errorBox?.classList.add('hidden');
      sync();
      return hiddenRef.current?.value ?? null;
    },
    focus: () => inputRef.current?.focus(),
  }));

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        type="tel"
        className={className}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        onInput={sync}
        autoComplete="tel"
      />
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} />
    </>
  );
}

import { getLocale, getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { isOvfleHost } from '@/lib/site/ovfle-host';
import { BRAND } from '../brand';
import { brandArabic, brandLatin } from '../fonts';
import '../installments.css';
import { FireworksBackground } from '@/components/animate-ui/backgrounds/fireworks';
import { ApplyForm } from './apply-form';
import { BrandLogo, ForwardArrow, Icon, MotionProvider } from './art';
import { type HeroSlide, HeroSlider } from './hero-slider';
import { MobileMenu } from './mobile-menu';
import { OpenButton } from './open-button';
import { Parallax } from './parallax';
import { RequestDialog } from './request-dialog';
import { ScrollReveal } from './reveal';
import { ThemeSwitch } from './theme-switch';
import { Suspense } from 'react';
import { JourneyPath, Marquee } from './scenes';

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string | string[] }) {
  const lines = (Array.isArray(subtitle) ? subtitle : subtitle ? [subtitle] : []).filter(Boolean);
  return (
    <div className="mx-auto max-w-2xl text-center" data-ov-reveal="">
      <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-(--ov-accent)">
        <span className="h-px w-6 bg-[#7DE6EE]" />
        {eyebrow}
        <span className="h-px w-6 bg-[#7DE6EE]" />
      </span>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-(--ov-fg) sm:text-4xl">{title}</h2>
      {lines.map((line, i) => (
        <p key={i} className={`${i === 0 ? 'mt-3' : 'mt-1.5'} text-base leading-relaxed text-(--ov-ink)/65`}>
          {line}
        </p>
      ))}
    </div>
  );
}

/** "Submitting is not an approval" notice (compliance). Hidden only if disabled in brand.ts. */
function Disclaimer({ text, className = '' }: { text: string; className?: string }) {
  if (!BRAND.showApprovalDisclaimer) return null;
  return (
    <p className={`flex items-start gap-2 text-xs leading-relaxed text-(--ov-ink)/55 ${className}`}>
      <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-(--ov-accent)/80" />
      <span>{text}</span>
    </p>
  );
}

/** Financing partner: official logo when configured in brand.ts, otherwise a text badge. */
function PartnerMark({ name, logo }: { name: string; logo: string | null }) {
  return (
    // Partner logos are drawn for light backgrounds, so they sit on a white card (with a soft brand glow).
    <div
      className={`ov-lift flex h-28 min-w-56 flex-1 items-center justify-center rounded-3xl px-8 sm:h-32 ${
        logo ? 'bg-white shadow-[0_20px_60px_-25px_rgb(125_230_238/0.45)] ring-1 ring-(--ov-accent)/30' : 'ov-card bg-(--ov-tint)/[0.04]'
      }`}
    >
      {logo ? (
        <img src={logo} alt={name} className="max-h-16 w-auto max-w-full object-contain" loading="lazy" />
      ) : (
        <span className="text-2xl font-extrabold tracking-tight text-(--ov-fg) sm:text-3xl">{name}</span>
      )}
    </div>
  );
}

/**
 * Ovfle landing page: car, smartphone and electronic-device installments.
 * Copy follows the "صفحة الهبوط أوفل" brief; commercial settings live in ../brand.ts and the message files.
 */
export type OvfleTheme = 'dark' | 'light';

export async function InstallmentsLanding({ theme = BRAND.theme }: { theme?: OvfleTheme } = {}) {
  const [t, locale, requestHeaders] = await Promise.all([getTranslations('Installments.landing'), getLocale(), headers()]);
  // Served on its own (sub)domain? Then the page is the site root (/ar, /en) and portal pages live on the portal host.
  const onOwnDomain = isOvfleHost(requestHeaders.get('host'));
  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const otherLocaleHref = onOwnDomain ? `/${otherLocale}` : `/${otherLocale}/services/installments`;
  const portal = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const supportHref = `${onOwnDomain ? portal : ''}/${locale}/services/customer-support-request`;
  const lang = locale === 'en' ? 'en' : 'ar';
  const brandName = BRAND.name[lang];
  const year = new Date().getFullYear();
  // Each image has a daylight twin in /images/ovfle/light (same framing) for the light theme.
  const asset = (name: string) => (theme === 'light' ? '/images/ovfle/light/' + name : '/images/ovfle/' + name);
  const partnerItems = BRAND.partners.map((p) => ({ name: p.name[lang], logo: p.logo?.[lang] ?? null }));

  const slides: HeroSlide[] = [
    {
      id: 'ovfle',
      image: asset('hero.webp'),
      // The light layer is tuned to the night photo only.
      lights: theme === 'dark',
      ...(theme === 'light' ? { focusX: 0 } : {}),
      eyebrow: t('s1_eyebrow'),
      title1: t('s1_title_1'),
      title2: t('s1_title_2'),
      subtitle: t('s1_subtitle'),
      primary: { label: t('hero_cta') },
      secondary: { label: t('hero_track'), action: 'track' },
    },
    {
      id: 'cars',
      image: asset('slide-showroom.webp'),
      focusX: 0, // subject sits on the photo's left half
      eyebrow: t('s2_eyebrow'),
      title1: t('s2_title_1'),
      title2: t('s2_title_2'),
      subtitle: t('s2_subtitle'),
      primary: { label: t('car_cta'), type: 'car' },
      secondary: { label: t('s2_how'), action: 'how' },
      partners: { label: t('s2_partners'), items: partnerItems },
    },
    {
      id: 'devices',
      image: asset('slide-devices.webp'),
      focusX: 0, // subject sits on the photo's left half
      eyebrow: t('s3_eyebrow'),
      title1: t('s3_title_1'),
      title2: t('s3_title_2'),
      subtitle: t('s3_subtitle'),
      primary: { label: t('device_cta'), type: 'device' },
      secondary: { label: t('hero_track'), action: 'track' },
    },
    {
      id: 'flex',
      image: asset('slide-flex.webp'),
      focusX: 0, // subject sits on the photo's left half
      eyebrow: t('s4_eyebrow'),
      title1: t('s4_title_1'),
      title2: t('s4_title_2'),
      subtitle: t('s4_subtitle'),
      primary: { label: t('hero_cta') },
      secondary: { label: t('hero_track'), action: 'track' },
    },
  ];

  const services = [
    // Phones are CASH only (no Ovfle installments): that card links out to the purchase page instead of the form.
    { type: 'phone' as const, cash: true, icon: 'phone' as const, image: asset('phones.webp'), label: t('phone_label'), title: t('phone_title'), desc: t('phone_desc'), cta: t('phone_cta') },
    { type: 'device' as const, cash: false, icon: 'device' as const, image: asset('devices.webp'), label: t('device_label'), title: t('device_title'), desc: t('device_desc'), cta: t('device_cta') },
    { type: 'car' as const, cash: false, icon: 'car' as const, image: asset('car.webp'), label: t('car_label'), title: t('car_title'), desc: t('car_desc'), cta: t('car_cta') },
  ];
  const reasons = [
    { icon: 'shield' as const, label: t('why_1') },
    { icon: 'wallet' as const, label: t('why_2') },
    { icon: 'phone' as const, label: t('why_3') },
    { icon: 'car' as const, label: t('why_4') },
    { icon: 'check' as const, label: t('why_5') },
  ];
  const stats = [
    { value: t('about_stat_months'), label: t('about_stat_months_label'), icon: 'clock' as const },
    { value: t('about_stat_services'), label: t('about_stat_services_label'), icon: 'spark' as const },
    ...(BRAND.showParentAttribution ? [{ value: t('about_stat_parent'), label: t('about_stat_parent_label'), icon: 'shield' as const, labelFirst: true }] : []),
  ];
  const steps = [
    { n: '01', icon: 'spark' as const, title: t('step_1_title'), desc: t('step_1_desc') },
    { n: '02', icon: 'id' as const, title: t('step_2_title'), desc: t('step_2_desc') },
    { n: '03', icon: 'clock' as const, title: t('step_3_title'), desc: t('step_3_desc') },
  ];
  const requirements = [
    { icon: 'id' as const, label: t('req_id') },
    { icon: 'wallet' as const, label: t('req_income') },
    { icon: 'briefcase' as const, label: t('req_work') },
    { icon: 'contact' as const, label: t('req_contact') },
    { icon: 'car' as const, label: t('req_car') },
  ];
  const company = [
    { label: t('footer_cr'), value: BRAND.company.commercialRegistration },
    { label: t('footer_vat'), value: BRAND.company.vatNumber },
    { label: t('footer_unified'), value: BRAND.company.unifiedNumber, tel: true },
  ].filter((row) => row.value);

  return (
    <MotionProvider>
    <div className={`installments ${brandLatin.variable} ${brandArabic.variable}`} data-service="installments" data-ov-theme={theme}>
      <div className="ov-scroll-progress" aria-hidden="true" />
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-(--ov-tint)/5 bg-(--ov-surface)/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="min-w-0" aria-label={brandName}>
            <BrandLogo className="text-[1.6rem] sm:text-[1.9rem]" />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-(--ov-ink)/70 lg:flex">
            <a href="#top" className="hover:text-(--ov-fg)">{t('nav_home')}</a>
            <a href="#about" className="hover:text-(--ov-fg)">{t('nav_about')}</a>
            <a href="#services" className="hover:text-(--ov-fg)">{t('nav_services')}</a>
            <a href="#how" className="hover:text-(--ov-fg)">{t('nav_how')}</a>
            <OpenButton tab="track" className="hover:text-(--ov-fg)">
              {t('nav_track')}
            </OpenButton>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Full page load on purpose: client-side navigation between rewritten URLs (own domain) keeps the
                old language's content. */}
            <a
              href={otherLocaleHref}
              hrefLang={otherLocale}
              lang={otherLocale}
              aria-label={t('switch_language')}
              className="inline-flex h-10 items-center rounded-full border border-(--ov-tint)/15 px-3 text-xs font-bold text-(--ov-ink)/80 sm:px-4 hover:border-(--ov-accent)/60 hover:text-(--ov-fg)"
            >
              {t('switch_language')}
            </a>
            <OpenButton tab="apply" className="ov-btn ov-btn-primary h-10! px-4! text-sm sm:px-5!">
              {t('nav_apply')}
            </OpenButton>
            <MobileMenu
              labels={{ open: t('menu_open'), close: t('menu_close') }}
              items={[
                { label: t('nav_home'), href: '#top' },
                { label: t('nav_about'), href: '#about' },
                { label: t('nav_services'), href: '#services' },
                { label: t('nav_how'), href: '#how' },
                { label: t('nav_track'), action: 'track' },
                { label: t('footer_link_support'), href: supportHref },
              ]}
            />
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero: 4-slide carousel (Ovfle / cars from dealers / phones & devices / up to 5 years) */}
        {/* The hero follows the theme: night photos in dark, their daylight twins in light. */}
        <Parallax className="relative isolate overflow-hidden" data-ov-theme={theme}>
          <HeroSlider
            slides={slides}
            labels={{ region: t('slides_label'), prev: t('slide_prev'), next: t('slide_next'), go: t.raw('slide_go') as string, pause: t('slide_pause'), play: t('slide_play') }}
            footer={<Disclaimer text={t('disclaimer_short')} className="mx-auto mt-6 max-w-xl justify-center text-center lg:mx-0 lg:justify-start lg:text-start" />}
          />
        </Parallax>

        {/* About Ovfle */}
        <section id="about" className="ov-texture relative scroll-mt-20 border-t border-(--ov-tint)/5 py-20">
          <div className="ov-glow -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 opacity-30" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
            <div className="ov-from-start" data-ov-reveal="">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-(--ov-accent)">
                <span className="h-px w-6 bg-[#7DE6EE]" />
                {t('about_eyebrow')}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-(--ov-fg) sm:text-4xl">{t('about_title')}</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-(--ov-ink)/70">
                <p>{t('about_p1')}</p>
                <p>{t('about_p2')}</p>
                <p>{t('about_p3')}</p>
                <p>{t('about_p4')}</p>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat, i) => (
                <li
                  key={stat.value}
                  data-ov-reveal="zoom"
                  style={{ ['--ov-delay' as string]: `${0.1 + i * 0.12}s` }}
                  className="ov-card ov-lift flex items-center gap-4 bg-(--ov-surface)/70 p-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--ov-accent)/10 text-(--ov-accent)">
                    <Icon name={stat.icon} className="h-6 w-6" />
                  </span>
                  <div className="flex flex-col">
                    {'labelFirst' in stat && <span className="text-xs text-(--ov-ink)/55">{stat.label}</span>}
                    <span className="text-2xl font-extrabold text-(--ov-fg)">{stat.value}</span>
                    {!('labelFirst' in stat) && <span className="text-xs text-(--ov-ink)/55">{stat.label}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The three services */}
        <section id="services" className="ov-texture relative scroll-mt-20 border-t border-(--ov-tint)/5 bg-(--ov-surface-2) py-20">
          <div className="ov-glow -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow={t('services_eyebrow')} title={t('services_title')} subtitle={[t('services_subtitle'), t('services_subtitle_2')]} />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <article
                  key={service.type}
                  data-ov-reveal=""
                  style={{ ['--ov-delay' as string]: `${0.2 + i * 0.15}s` }}
                  className={`ov-card ov-lift group relative flex flex-col overflow-hidden bg-(--ov-surface)/60 backdrop-blur-sm${service.cash ? ' ov-cash-card' : ''}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-(--ov-accent)/10 bg-(--ov-surface-2)">
                    <img
                      src={service.image}
                      alt={service.label}
                      loading="lazy"
                      className="ov-unveil h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-(--ov-surface) to-transparent" />
                    {service.cash ? (
                      // Cash: a diagonal ribbon across the corner (not an installment badge), readable before any text.
                      <span className="ov-cash-ribbon" aria-hidden="true">
                        <Icon name="cash" className="h-4 w-4" strokeWidth={2.2} />
                        {t('phone_cash_badge')}
                      </span>
                    ) : (
                      // Same ribbon shape as "cash", in the brand's sky: the two payment types read as a pair.
                      <span className="ov-installment-ribbon" aria-hidden="true">
                        <Icon name="clock" className="h-4 w-4" strokeWidth={2.2} />
                        {t('installment_badge')}
                      </span>
                    )}
                  </div>
                  <div className="relative flex flex-1 flex-col p-7">
                    <span className="sr-only">{service.cash ? t('phone_cash_badge') : t('installment_badge')}: </span>
                    <h3 className="text-xl font-extrabold text-(--ov-fg)">{service.title}</h3>
                    {service.cash && (
                      <ul className="mt-3 flex flex-wrap gap-2" aria-label={t('phone_cash_badge')}>
                        {[t('phone_point_1'), t('phone_point_2')].map((point) => (
                          <li key={point} className="ov-cash-chip">
                            <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-3 flex-1 leading-relaxed text-(--ov-ink)/65">{service.desc}</p>
                    {service.cash ? (
                      BRAND.phonePurchaseUrl && (
                        <a href={BRAND.phonePurchaseUrl} target="_blank" rel="noopener noreferrer" className="ov-btn ov-btn-cash mt-6 self-start">
                          <Icon name="cash" className="h-4 w-4" strokeWidth={2.2} />
                          {service.cta}
                          <Icon name="external" className="h-3.5 w-3.5 opacity-80" strokeWidth={2.2} />
                          <span className="sr-only">({t('phone_cta_new_tab')})</span>
                        </a>
                      )
                    ) : (
                      <OpenButton tab="apply" type={service.type} className="ov-btn ov-btn-primary mt-6 self-start">
                        {service.cta}
                        <ForwardArrow />
                      </OpenButton>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Marquee items={[t('marquee_1'), t('marquee_2'), t('marquee_3'), t('marquee_4'), t('marquee_5')]} />

        {/* Why Ovfle */}
        <section id="why" className="ov-texture relative scroll-mt-20 py-20">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow={t('why_eyebrow')} title={t('why_title')} />
            <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {reasons.map((reason, i) => (
                <li
                  key={reason.label}
                  data-ov-reveal="zoom"
                  style={{ ['--ov-delay' as string]: `${0.1 + i * 0.1}s` }}
                  className={`ov-card ov-lift flex flex-col items-center gap-4 bg-(--ov-surface)/60 px-4 py-7 text-center${i === reasons.length - 1 ? ' col-span-2 md:col-span-1' : ''}`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-(--ov-accent)/30 bg-(--ov-accent)/10 text-(--ov-accent) shadow-[0_0_30px_-10px_rgb(125_230_238/0.6)]">
                    <Icon name={reason.icon} className="h-7 w-7" />
                  </span>
                  <span className="text-sm leading-relaxed font-bold text-(--ov-ink)/85">{reason.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Financing partners (cars) */}
        <section id="partners" className="relative scroll-mt-20 border-t border-(--ov-tint)/5 bg-(--ov-surface-2) py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow={t('partners_eyebrow')} title={t('partners_title')} subtitle={t('partners_subtitle')} />
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-4" data-ov-reveal="zoom">
              {BRAND.partners.map((partner) => (
                <PartnerMark key={partner.id} name={partner.name[lang]} logo={partner.logo?.[lang] ?? null} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works + requirements */}
        <section id="how" className="ov-texture scroll-mt-20 border-t border-(--ov-tint)/5 bg-(--ov-surface-3) py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow={t('how_eyebrow')} title={t('how_title')} />
            <ol className="relative mt-12 grid gap-5 md:grid-cols-3 md:pt-24" data-ov-reveal="">
              {/* journey path: a light travels through the three steps */}
              <JourneyPath />
              {steps.map((step, i) => (
                <li
                  key={step.n}
                  data-ov-reveal=""
                  // Solid background so the path runs only through the gaps between cards.
                  style={{ ['--ov-delay' as string]: `${0.15 + i * 0.18}s`, background: 'linear-gradient(180deg, var(--ov-surface-4), var(--ov-surface-3))' }}
                  className="ov-card ov-lift relative z-10 p-7"
                >
                  <span className="ov-wordmark text-5xl opacity-25" dir="ltr">
                    {step.n}
                  </span>
                  <span className="absolute top-7 flex h-11 w-11 items-center justify-center rounded-xl border border-(--ov-accent)/30 text-(--ov-accent) ltr:right-7 rtl:left-7">
                    <Icon name={step.icon} />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold text-(--ov-fg)">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--ov-ink)/60">{step.desc}</p>
                </li>
              ))}
            </ol>

            <div className="ov-from-end mt-10 rounded-3xl border border-(--ov-accent)/20 bg-(--ov-surface) p-6 sm:p-8" data-ov-reveal="">
              <h3 className="text-base font-extrabold text-(--ov-fg)">{t('req_title')}</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {requirements.map((req, i) => (
                  <li
                    key={req.label}
                    data-ov-reveal="zoom"
                    style={{ ['--ov-delay' as string]: `${0.1 + i * 0.08}s` }}
                    className="ov-lift flex items-center gap-3 rounded-2xl border border-transparent bg-(--ov-tint)/[0.04] px-4 py-3 text-sm text-(--ov-ink)/85"
                  >
                    <Icon name={req.icon} className="h-5 w-5 shrink-0 text-(--ov-accent)" />
                    {req.label}
                  </li>
                ))}
              </ul>
              <Disclaimer text={t('disclaimer_full')} className="mt-6" />
            </div>
          </div>
        </section>

        {/* Ready to start: fireworks behind, the request form inline (same form as the dialog) */}
        <section id="apply" className="relative scroll-mt-20 overflow-hidden border-t border-(--ov-tint)/5 bg-(--ov-surface-2) py-20">
          <FireworksBackground
            className="absolute! inset-0 opacity-70"
            population={0.6}
            color={theme === 'light' ? ['#0B8C99', '#3FC9D6', '#11131A', '#5FCFD9'] : ['#7DE6EE', '#3FC9D6', '#E6FAFC', '#A5F0F5']}
            particleSize={{ min: 1, max: 3 }}
          />
          <div className="ov-glow -bottom-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 opacity-50" />
          <div className="pointer-events-none relative z-10 mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="ov-from-start pointer-events-auto text-center lg:sticky lg:top-28 lg:text-start" data-ov-reveal="">
              <h2 className="text-3xl font-extrabold tracking-tight text-(--ov-fg) sm:text-5xl">{t('cta_title')}</h2>
              <p className="mt-4 leading-relaxed text-(--ov-ink)/65">{t('cta_subtitle')}</p>
              <ul className="mt-8 space-y-3 text-sm text-(--ov-ink)/80">
                {[t('why_3'), t('step_1_desc'), t('step_3_desc')].map((point) => (
                  <li key={point} className="flex items-center justify-center gap-3 lg:justify-start">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--ov-accent)/15 text-(--ov-accent)">
                      <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <OpenButton tab="track" className="ov-btn ov-btn-ghost mt-8">
                <Icon name="search" className="h-4 w-4" />
                {t('hero_track')}
              </OpenButton>
            </div>

            <div className="ov-zoom-in pointer-events-auto" data-ov-reveal="zoom">
              <div className="ov-card ov-neon-border relative z-10 overflow-hidden bg-(--ov-surface) p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--ov-accent)/10 text-(--ov-accent)">
                    <Icon name="spark" className="h-5 w-5" loop />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-(--ov-fg)">{t('form_section_title')}</h3>
                    <p className="mt-0.5 text-xs text-(--ov-ink)/55">{t('form_section_subtitle')}</p>
                  </div>
                </div>
                <ApplyForm idPrefix="ov-inline" listenToOpen={false} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* Dark footer in both themes (anchors the light page). */}
      <footer className="border-t border-(--ov-tint)/5 bg-(--ov-surface-2)" data-ov-theme="dark">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,3fr))]">
          <div>
            <BrandLogo className="text-3xl" />
            <p className="mt-4 text-sm leading-relaxed text-(--ov-ink)/60">
              {BRAND.showParentAttribution ? t('footer_about') : t('footer_tagline')}
            </p>
          </div>

          {company.length > 0 && (
            <div>
              <h2 className="text-sm font-extrabold text-(--ov-fg)">{t('footer_company')}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {company.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs text-(--ov-ink)/50">{row.label}</dt>
                    <dd className="mt-0.5 font-bold text-(--ov-ink)/85">
                      {row.tel ? (
                        <a href={`tel:${row.value}`} className="hover:text-(--ov-accent)" dir="ltr">
                          {row.value}
                        </a>
                      ) : (
                        <span dir="ltr">{row.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div>
            <h2 className="text-sm font-extrabold text-(--ov-fg)">{t('footer_links')}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-(--ov-ink)/65">
              <li>
                <a href="#top" className="hover:text-(--ov-accent)">{t('footer_link_home')}</a>
              </li>
              <li>
                <a href="#services" className="hover:text-(--ov-accent)">{t('footer_link_services')}</a>
              </li>
              <li>
                <OpenButton tab="track" className="hover:text-(--ov-accent)">
                  {t('footer_link_track')}
                </OpenButton>
              </li>
              <li>
                <a href={supportHref} className="hover:text-(--ov-accent)">{t('footer_link_support')}</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-(--ov-fg)">{t('footer_contact')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-(--ov-ink)/60">{t('footer_contact_text')}</p>
            {BRAND.company.unifiedNumber && (
              <a
                href={`tel:${BRAND.company.unifiedNumber}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-(--ov-accent)/30 px-4 py-2 text-sm font-extrabold text-(--ov-accent) hover:bg-(--ov-accent)/10"
                dir="ltr"
              >
                <Icon name="phone" className="h-4 w-4" />
                {BRAND.company.unifiedNumber}
              </a>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <Disclaimer text={t('disclaimer_full')} className="border-t border-(--ov-tint)/5 pt-6" />
          <div className="mt-4 text-xs text-(--ov-ink)/40">
            © {year} {brandName} · {t('footer_rights')}
          </div>
        </div>
      </footer>

      <RequestDialog />
      <ScrollReveal />
      {BRAND.themePreview && (
        <Suspense>
          <ThemeSwitch current={theme} labels={{ title: t('theme_title'), dark: t('theme_dark'), light: t('theme_light') }} />
        </Suspense>
      )}
    </div>
    </MotionProvider>
  );
}

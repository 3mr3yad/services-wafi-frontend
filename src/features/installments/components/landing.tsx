import { getLocale, getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { Link } from '@/i18n/navigation';
import { BRAND } from '../brand';
import { brandArabic, brandLatin } from '../fonts';
import '../installments.css';
import { BrandLogo, ForwardArrow, Icon } from './art';
import { OpenButton } from './open-button';
import { Parallax } from './parallax';
import { RequestDialog } from './request-dialog';
import { ScrollReveal } from './reveal';
import { CarShowcaseArt, JourneyPath, Marquee, PhoneShowcaseArt, SkyBackdrop } from './scenes';

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center" data-ov-reveal="">
      <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[#7DE6EE]">
        <span className="h-px w-6 bg-[#7DE6EE]" />
        {eyebrow}
        <span className="h-px w-6 bg-[#7DE6EE]" />
      </span>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-[#E6FAFC]/65">{subtitle}</p>}
    </div>
  );
}

/** "Submitting is not an approval" notice (compliance). Hidden only if disabled in brand.ts. */
function Disclaimer({ text, className = '' }: { text: string; className?: string }) {
  if (!BRAND.showApprovalDisclaimer) return null;
  return (
    <p className={`flex items-start gap-2 text-xs leading-relaxed text-[#E6FAFC]/55 ${className}`}>
      <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-[#7DE6EE]/80" />
      <span>{text}</span>
    </p>
  );
}

/**
 * Ovfle landing page: car + smartphone installments, equally prominent.
 * Brand name, parent attribution and disclaimers are configured in ../brand.ts and the message files.
 */
export async function InstallmentsLanding() {
  const [t, locale] = await Promise.all([getTranslations('Installments.landing'), getLocale()]);
  const brandName = BRAND.name[locale === 'en' ? 'en' : 'ar'];
  const year = new Date().getFullYear();
  const statusLabels = {
    title: t('status_mock_title'),
    received: t('status_mock_received'),
    review: t('status_mock_review'),
    result: t('status_mock_result'),
  };

  const services = [
    { type: 'car' as const, icon: 'car' as const, label: t('car_label'), title: t('car_title'), desc: t('car_desc'), cta: t('car_cta') },
    { type: 'phone' as const, icon: 'phone' as const, label: t('phone_label'), title: t('phone_title'), desc: t('phone_desc'), cta: t('phone_cta') },
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

  return (
    <div className={`installments ${brandLatin.variable} ${brandArabic.variable}`} data-service="installments">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#11131A]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="min-w-0" aria-label={brandName}>
            <BrandLogo className="text-[1.9rem]" />
          </a>
          <nav className="hidden items-center gap-7 text-sm font-bold text-[#E6FAFC]/70 md:flex">
            <a href="#services" className="hover:text-white">{t('nav_services')}</a>
            <a href="#how" className="hover:text-white">{t('nav_how')}</a>
            <OpenButton tab="track" className="hover:text-white">
              {t('nav_track')}
            </OpenButton>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <LocaleSwitcher
              label={t('switch_language')}
              targetName={t('switch_language')}
              className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-xs font-bold text-[#E6FAFC]/80 hover:border-[#7DE6EE]/60 hover:text-white"
            />
            <OpenButton tab="apply" className="ov-btn ov-btn-primary h-10! px-5! text-sm">
              {t('nav_apply')}
            </OpenButton>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero: one message, both services side by side with equal weight */}
        <Parallax className="relative overflow-hidden">
          <section className="relative">
            <SkyBackdrop />
            <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 lg:pt-20">
              <div className="mx-auto max-w-4xl text-center">
                <span className="ov-rise inline-flex items-center gap-2 rounded-full border border-[#7DE6EE]/30 bg-[#7DE6EE]/10 px-4 py-1.5 text-xs font-bold text-[#7DE6EE]">
                  <Icon name="spark" className="h-3.5 w-3.5" />
                  {t('hero_eyebrow')}
                </span>
                <h1 className="mt-6 text-4xl leading-[1.25] font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
                  <span className="ov-rise block" style={{ ['--ov-delay' as string]: '0.12s' }}>
                    {t('hero_title_1')}
                  </span>
                  <span className="ov-rise ov-shine-text mt-2 block" style={{ ['--ov-delay' as string]: '0.28s' }}>
                    {t('hero_title_2')}
                  </span>
                </h1>
                <p className="ov-rise mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#E6FAFC]/70" style={{ ['--ov-delay' as string]: '0.44s' }}>
                  {t('hero_subtitle')}
                </p>
                <div className="ov-rise mt-8 flex flex-wrap justify-center gap-3" style={{ ['--ov-delay' as string]: '0.6s' }}>
                  <OpenButton tab="apply" className="ov-btn ov-btn-primary">
                    {t('hero_cta')}
                    <ForwardArrow />
                  </OpenButton>
                  <OpenButton tab="track" className="ov-btn ov-btn-ghost">
                    <Icon name="search" className="h-4 w-4" />
                    {t('hero_track')}
                  </OpenButton>
                </div>
                <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-[#E6FAFC]/75">
                  {[t('hero_point_1'), t('hero_point_2'), t('hero_point_3')].map((point, i) => (
                    <li key={point} className="ov-rise flex items-center gap-2" style={{ ['--ov-delay' as string]: `${0.75 + i * 0.12}s` }}>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7DE6EE]/15 text-[#7DE6EE]">
                        <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Disclaimer text={t('disclaimer_short')} className="ov-rise mx-auto mt-6 max-w-xl justify-center text-center" />
              </div>

              {/* The two services, equal size */}
              <div id="services" className="mt-14 grid scroll-mt-24 gap-5 md:grid-cols-2">
                {services.map((service, i) => (
                  <article
                    key={service.type}
                    data-ov-reveal=""
                    style={{ ['--ov-delay' as string]: `${0.2 + i * 0.15}s` }}
                    className="ov-card ov-lift group relative overflow-hidden bg-[#11131A]/60 backdrop-blur-sm"
                  >
                    <div className="absolute -top-24 h-56 w-56 rounded-full bg-[#7DE6EE]/10 blur-3xl transition group-hover:bg-[#7DE6EE]/20 ltr:-right-16 rtl:-left-16" />
                    <div className="relative border-b border-[#7DE6EE]/10">
                      {service.type === 'car' ? <CarShowcaseArt /> : <PhoneShowcaseArt labels={statusLabels} />}
                      <span className="absolute top-4 inline-flex items-center gap-2 rounded-full border border-[#7DE6EE]/25 bg-[#11131A]/70 px-3 py-1.5 text-xs font-bold text-[#E6FAFC] backdrop-blur ltr:left-4 rtl:right-4">
                        <Icon name={service.icon} className="h-4 w-4 text-[#7DE6EE]" />
                        {service.label}
                      </span>
                    </div>
                    <div className="relative p-7 sm:p-8">
                      <h2 className="text-2xl font-extrabold text-white">{service.title}</h2>
                      <p className="mt-3 max-w-md leading-relaxed text-[#E6FAFC]/65">{service.desc}</p>
                      <OpenButton tab="apply" type={service.type} className="ov-btn ov-btn-primary mt-6">
                        {service.cta}
                        <ForwardArrow />
                      </OpenButton>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </Parallax>

        <Marquee items={[t('car_title'), t('phone_title'), t('hero_point_1'), t('hero_point_2'), t('hero_point_3')]} />

        {/* How it works + requirements */}
        <section id="how" className="ov-texture scroll-mt-20 border-t border-white/5 bg-[#171a24] py-20">
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
                  style={{ ['--ov-delay' as string]: `${0.15 + i * 0.18}s`, background: 'linear-gradient(180deg, #1c1f2a, #171a24)' }}
                  className="ov-card ov-lift relative z-10 p-7"
                >
                  <span className="ov-wordmark text-5xl opacity-25" dir="ltr">
                    {step.n}
                  </span>
                  <span className="absolute top-7 flex h-11 w-11 items-center justify-center rounded-xl border border-[#7DE6EE]/30 text-[#7DE6EE] ltr:right-7 rtl:left-7">
                    <Icon name={step.icon} />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#E6FAFC]/60">{step.desc}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-3xl border border-[#7DE6EE]/20 bg-[#11131A] p-6 sm:p-8" data-ov-reveal="">
              <h3 className="text-base font-extrabold text-white">{t('req_title')}</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {requirements.map((req, i) => (
                  <li
                    key={req.label}
                    data-ov-reveal="zoom"
                    style={{ ['--ov-delay' as string]: `${0.1 + i * 0.08}s` }}
                    className="ov-lift flex items-center gap-3 rounded-2xl border border-transparent bg-white/[0.04] px-4 py-3 text-sm text-[#E6FAFC]/85"
                  >
                    <Icon name={req.icon} className="h-5 w-5 shrink-0 text-[#7DE6EE]" />
                    {req.label}
                  </li>
                ))}
              </ul>
              <Disclaimer text={t('disclaimer_full')} className="mt-6" />
            </div>
          </div>
        </section>

        {/* Call to action: both buttons open the request dialog */}
        <section className="ov-texture relative overflow-hidden border-t border-white/5 py-20">
          <div className="ov-glow -bottom-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 opacity-60" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6" data-ov-reveal="zoom">
            <div className="ov-card ov-neon-border flex flex-col items-center gap-8 overflow-hidden p-8 text-center sm:p-12 lg:flex-row lg:justify-between lg:text-start">
              <div className="max-w-xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t('cta_title')}</h2>
                <p className="mt-3 leading-relaxed text-[#E6FAFC]/65">{t('cta_subtitle')}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <OpenButton tab="apply" type="car" className="ov-btn ov-btn-primary">
                  <Icon name="car" className="h-4 w-4" />
                  {t('car_cta')}
                </OpenButton>
                <OpenButton tab="apply" type="phone" className="ov-btn ov-btn-primary">
                  <Icon name="phone" className="h-4 w-4" />
                  {t('phone_cta')}
                </OpenButton>
                <OpenButton tab="track" className="ov-btn ov-btn-ghost">
                  <Icon name="search" className="h-4 w-4" />
                  {t('hero_track')}
                </OpenButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0c0e13]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-sm">
              <BrandLogo className="text-3xl" />
              <p className="mt-3 text-sm text-[#E6FAFC]/55">{t('footer_tagline')}</p>
            </div>
            {BRAND.showParentAttribution && (
              <div className="flex flex-col gap-2 text-sm sm:items-end">
                <span className="text-xs text-[#E6FAFC]/50">{t('parent_attribution')}</span>
                <Link href="/" className="text-xs font-bold text-[#7DE6EE]/80 hover:underline">
                  {t('footer_back')}
                </Link>
              </div>
            )}
          </div>
          <Disclaimer text={t('disclaimer_full')} className="mt-8 border-t border-white/5 pt-6" />
          <div className="mt-4 text-xs text-[#E6FAFC]/40">
            © {year} {brandName} · {t('footer_rights')}
          </div>
        </div>
      </footer>

      <RequestDialog />
      <ScrollReveal />
    </div>
  );
}

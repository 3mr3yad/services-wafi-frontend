import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { HOME_SERVICES, POLICY_URL, R2_BASE, SOCIAL_LINKS } from '../home-data';
import '../styles/home.css';
import { HomeHeader } from './home-header';
import { Icon, IconSprite } from './icon-sprite';
import { QuickTracker } from './quick-tracker';
import { RevealObserver } from './reveal-observer';

/** Splits "Name (Suffix)" into its parts, like home.blade.php. */
function splitName(name: string): [string, string | null] {
  const match = name.match(/^(.*?)\s*\(([^)]+)\)$/u);
  return match ? [match[1] ?? name, `(${match[2]})`] : [name, null];
}

/** The wafiservices homepage, ported 1:1 from resources/views/home.blade.php. */
export async function HomePage() {
  const [t, tl] = await Promise.all([getTranslations('Home'), getTranslations('Layout')]);
  const year = new Date().getFullYear();

  return (
    <div className="wafi-home" id="wafi-home-root">
      <IconSprite />

      <HomeHeader
        labels={{
          home: tl('nav_home'),
          services: tl('nav_services'),
          protection: tl('nav_protection'),
          how: tl('nav_how'),
          trackNow: t('track_now'),
          switchLanguage: tl('switch_language'),
        }}
      />

      <main>
        {/* Hero */}
        <section className="hero" id="home" style={{ backgroundImage: `url('${R2_BASE}/heroBanner.jpeg')` }}>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="container">
            <div className="hero-content" data-reveal="">
              <span className="hero-badge">{t('eyebrow')}</span>
              <h1>{t('hero_headline')}</h1>
              <p>{t('hero_subtitle')}</p>
              <div className="hero-actions">
                <a href="#services" className="btn btn-light">
                  {t('browse_services')} <Icon name="arrow" />
                </a>
                <a href="#tracker" className="btn btn-ghost">
                  <Icon name="search" /> {t('track_now')}
                </a>
              </div>
              <div className="hero-chips">
                <a href="#services">{t('intent_all')}</a>
                <a href="#service-refund">{t('intent_refund')}</a>
                <a href="#service-resale">{t('intent_resale')}</a>
                <a href="#service-customer_support">{t('intent_support')}</a>
              </div>
            </div>
          </div>
        </section>

        {/* Track */}
        <QuickTracker
          labels={{
            title: t('tracker_title'),
            subtitle: t('tracker_subtitle'),
            inputLabel: t('tracker_input_label'),
            placeholder: t('tracker_unified_placeholder'),
            submit: t('tracker_submit'),
            searching: t('tracker_searching'),
            empty: t('tracker_empty'),
            modalTitle: t('tracker_modal_title'),
            modalClose: t('tracker_modal_close'),
            resultsCount: t.raw('tracker_results_count') as string,
            dateLabel: t('tracker_date_label'),
            nameLabel: t('tracker_name_label'),
            phoneLabel: t('tracker_phone_label'),
            attachmentsLabel: t('tracker_attachments_label'),
          }}
        />

        {/* Services */}
        <section className="section" id="services">
          <div className="container">
            <div className="section-head" data-reveal="">
              <span className="eyebrow">{t('service_label')}</span>
              <h2>{t('services_title')}</h2>
              <p>{t('services_subtitle')}</p>
            </div>

            <div className="services-grid">
              {HOME_SERVICES.map((service) => {
                const [nameMain, nameSuffix] = splitName(t(`services.${service.id}.name`));
                return (
                  <article key={service.id} id={`service-${service.id}`} className={`service${service.wide ? ' wide' : ''}`} data-reveal="">
                    <div className="service-body">
                      <div className="service-title">
                        <div className="icon-bubble">
                          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d={service.icon} />
                          </svg>
                        </div>
                        <h3>
                          {nameMain}
                          {nameSuffix && <span>{nameSuffix}</span>}
                        </h3>
                      </div>
                      <p>{t(`services.${service.id}.short_desc`)}</p>
                      <div className="service-requirements">
                        {t('requirements_label')} {t(`services.${service.id}.requirements`)}
                      </div>
                      <Link href={service.href} className="service-link">
                        {service.id === 'protection' ? t('explore_showcase') : t('start_now')}
                        <Icon name="arrow" />
                      </Link>
                    </div>
                    {service.art && <img className="service-art" src={service.art} alt="" loading="lazy" />}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="steps-section" id="how">
          <div className="container">
            <div className="section-head" data-reveal="">
              <h2>{t('how_it_works_title')}</h2>
              <p>{t('how_it_works_subtitle')}</p>
            </div>
            <ol className="steps" data-reveal="">
              {[1, 2, 3].map((step) => (
                <StepItem key={step} step={step} title={t(`step_${step}_title`)} description={t(`step_${step}_desc`)} />
              ))}
            </ol>
          </div>
        </section>

        {/* Banner */}
        <section className="banner-wrap">
          <div className="container" data-reveal="">
            <div className="banner">
              <div className="banner-text">
                <div className="icon-bubble">
                  <Icon name="bell" />
                </div>
                <div>
                  <h2>{t('banner_title')}</h2>
                  <p>{t('banner_subtitle')}</p>
                </div>
              </div>
              <img className="banner-art" src="/images/landing/banner-phone.png" alt="" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features" aria-label="مزايا البوابة">
          <div className="container" data-reveal="">
            <ul>
              {(
                [
                  ['bolt', 'fast'],
                  ['shield', 'tracking'],
                  ['db', 'protection'],
                  ['users', 'support'],
                ] as const
              ).map(([icon, key]) => (
                <li key={key}>
                  <Icon name={icon} />
                  <div>
                    <strong>{t(`value_${key}`)}</strong>
                    <span>{t(`value_${key}_desc`)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link href="/" className="brand">
              <img src="/images/logo.png" alt="" />
            </Link>
            <p style={{ margin: 0, maxWidth: '34ch' }}>{tl('footer_tagline')}</p>
          </div>
          <div>
            <h3>{tl('nav_services')}</h3>
            <ul>
              <li><Link href="/services/xleader">{tl('nav_xleader')}</Link></li>
              <li><Link href="/services/resale">{tl('nav_resale')}</Link></li>
              <li><Link href="/services/refund">{tl('nav_refund')}</Link></li>
              <li><Link href="/services/protection">{tl('nav_protection')}</Link></li>
              <li><Link href="/services/customer-support-request">{tl('nav_customer_support')}</Link></li>
            </ul>
          </div>
          <div>
            <h3>{tl('footer_policies_label')}</h3>
            <ul>
              <li>
                <a href={POLICY_URL} target="_blank" rel="noopener">
                  {tl('footer_terms')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>{tl('footer_contact')}</h3>
            <div className="socials">
              {SOCIAL_LINKS.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener" aria-label={social.label}>
                  <Icon name={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {year} عالم وافي. {tl('footer_rights')}.
        </div>
      </footer>

      <RevealObserver />
    </div>
  );
}

function StepItem({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <>
      {step > 1 && (
        <li className="step-arrow" aria-hidden="true">
          <Icon name="arrow" />
        </li>
      )}
      <li className="step">
        <img className="step-icon" src={`${R2_BASE}/03_icon_step${step}_128x128.png`} alt="" loading="lazy" />
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </li>
    </>
  );
}

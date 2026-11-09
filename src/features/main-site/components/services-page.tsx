import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ALL_SERVICES, R2_BASE } from '../home-data';
import '../styles/home.css';
import { HomeHeader } from './home-header';
import { Icon, IconSprite } from './icon-sprite';
import { RevealObserver } from './reveal-observer';
import { ServiceCard } from './service-card';
import { SiteFooter } from './site-footer';

/** /services: every service of the portal, in the homepage's visual language. */
export async function ServicesPage() {
  const [t, tl] = await Promise.all([getTranslations('Home'), getTranslations('Layout')]);

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
        {/* Page header */}
        <section className="page-hero" style={{ backgroundImage: `url('${R2_BASE}/heroBanner.jpeg')` }}>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="container">
            <nav className="breadcrumbs" aria-label={tl('nav_services')} data-reveal="">
              <Link href="/">{tl('nav_home')}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{tl('nav_services')}</span>
            </nav>
            <div data-reveal="">
              <h1>{t('services_title')}</h1>
              <p>{t('services_page_subtitle')}</p>
              <span className="hero-badge page-count">{t('services_count', { count: ALL_SERVICES.length })}</span>
            </div>
          </div>
        </section>

        {/* All services */}
        <section className="section" id="services">
          <div className="container">
            <div className="services-grid">
              {ALL_SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  name={t(`services.${service.id}.name`)}
                  description={t(`services.${service.id}.short_desc`)}
                  requirementsLabel={t('requirements_label')}
                  requirements={t(`services.${service.id}.requirements`)}
                  cta={service.id === 'protection' ? t('explore_showcase') : t('start_now')}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Track an existing request */}
        <section className="banner-wrap services-track">
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
              <Link href="/#tracker" className="btn btn-light banner-cta">
                <Icon name="search" /> {t('track_now')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <RevealObserver />
    </div>
  );
}

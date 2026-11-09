import { getLocale, getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { FormDock } from './form-dock';
import { Hero } from './hero';
import { Counter, Reveal, Words } from './motion';
import { ProductsDuel } from './products-duel';
import { ProtectionLayers } from './protection-layers';
import { Videos } from './videos';
import { Warranty } from './warranty';

const IMG = '/images/protection';
// The lightbox clips (30-90 MB each) stay on the old host: too large to ship as static assets.
const VIDEO_BASE = 'https://wafii.sa/wafiservices/new-home/media/videos';

const MARQUEE = [
  { key: 'quality', variant: 'is-accent' },
  { key: 'durability', variant: 'is-solid' },
  { key: 'warranty', variant: 'is-outline' },
  { key: 'trust', variant: 'is-accent' },
  { key: 'elegance', variant: 'is-solid' },
] as const;

const STATS = ['compensation', 'warranty', 'angles', 'phones'] as const;

const VIDEOS = [
  { key: 'blixPackage', file: 'blix-package', duration: '0:47' },
  { key: 'blixCase', file: 'blix-case', duration: '0:22' },
  { key: 'blixLens', file: 'blix-lens', duration: '0:17' },
  { key: 'xleaderPackage', file: 'xleader-package', duration: '0:44' },
  { key: 'xleaderCase', file: 'xleader-case', duration: '0:28' },
  { key: 'xleaderLens', file: 'xleader-lens', duration: '0:07' },
] as const;

function Spark() {
  return (
    <svg className="marquee__spark" viewBox="0 0 24 24" width="15" height="15">
      <path d="M12 2l2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2z" fill="currentColor" />
    </svg>
  );
}

/** "Wafi Advanced Protection Packages" landing page, rebuilt from the old static export. */
export async function ProtectionLanding() {
  const [t, locale] = await Promise.all([getTranslations('Protection'), getLocale()]);

  const pillars = [1, 2, 3].map((n) => ({ title: t(`about.pillar${n}Title`), desc: t(`about.pillar${n}Desc`) }));
  const videos = VIDEOS.map((v) => ({
    title: t(`videos.${v.key}`),
    duration: v.duration,
    thumb: `${IMG}/${v.file}.jpg`,
    src: `${VIDEO_BASE}/${v.file}.mp4`,
  }));
  // The original dock embedded /wafiservices/xleader?embed=1 (the X-Leader warranty registration form).
  const dockSrc = `${getPathname({ href: '/services/xleader', locale })}?embed=1`;

  return (
    <>
      <Hero
        content={{
          kicker: t('hero.kicker'),
          title: [t('hero.titleLine1'), t('hero.titleLine2')],
          lead: t('hero.lead'),
          primary: t('hero.primary'),
          secondary: t('hero.secondary'),
          features: [t('hero.feature1'), t('hero.feature2'), t('hero.feature3')],
          scroll: t('hero.scroll'),
          scrollLabel: t('hero.scrollLabel'),
        }}
      />

      <section className="marquee" aria-hidden="true">
        <div className="marquee__glow" />
        <div className="marquee__track">
          {[0, 1].map((group) => (
            <div key={group} className="marquee__group">
              {MARQUEE.map((item) => (
                <span key={item.key} className="marquee__pair">
                  <span className={`marquee__item ${item.variant}`}>{t(`marquee.${item.key}`)}</span>
                  <Spark />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="about">
        <div className="about__head">
          <Reveal as="p" className="section-kicker">
            <i />
            {t('about.kicker')}
          </Reveal>
          <h2 className="about__headline">
            <Words text={t('about.headline')} />
          </h2>
          <Reveal as="p" className="about__body" delay={0.1}>
            {t('about.body')}
          </Reveal>
        </div>
        <div className="about__grid">
          <ProtectionLayers labels={pillars.map((p) => p.title)} caption={t('about.caption')} image={`${IMG}/about-photo.png`} />
          <div className="about__pillars">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} as="article" className="pillar" delay={i * 0.08}>
                <span className="pillar__no">0{i + 1}</span>
                <h3 className="pillar__title">{pillar.title}</h3>
                <p className="pillar__desc">{pillar.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="stats">
          {STATS.map((key) => (
            <Reveal key={key} className="stat">
              <Counter to={t(`stats.${key}Value`)} suffix={t(`stats.${key}Suffix`)} />
              <div className="stat__label">{t(`stats.${key}Label`)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <ProductsDuel
        kicker={t('products.kicker')}
        title={t('products.title')}
        cta={t('products.cta')}
        items={[
          {
            no: '01',
            name: t('products.blixName'),
            category: t('products.blixCategory'),
            desc: t('products.blixDesc'),
            img: `${IMG}/blix-product.png`,
          },
          {
            no: '02',
            name: t('products.xleaderName'),
            category: t('products.xleaderCategory'),
            desc: t('products.xleaderDesc'),
            img: `${IMG}/xleader-product.png`,
          },
        ]}
      />

      <Videos
        items={videos}
        kicker={t('videos.kicker')}
        title={t('videos.title')}
        nextLabel={t('videos.next')}
        prevLabel={t('videos.prev')}
        showLabels={videos.map((v) => t('videos.show', { title: v.title }))}
        closeLabel={t('videos.close')}
      />

      <Warranty
        content={{
          kicker: t('warranty.kicker'),
          headline: t('warranty.headline'),
          body: t('warranty.body'),
          cta: t('warranty.cta'),
          steps: [1, 2, 3].map((n) => ({ no: `0${n}`, title: t(`warranty.step${n}Title`), desc: t(`warranty.step${n}Desc`) })),
          panelTitle: t('warranty.panelTitle'),
          previewNext: t('warranty.previewNext'),
          badgeSecure: t('warranty.badgeSecure'),
          badgeInstant: t('warranty.badgeInstant'),
          hint: t('warranty.hint'),
        }}
      />

      <FormDock
        label={t('warranty.cta')}
        title={t('warranty.panelTitle')}
        src={dockSrc}
        closeFormLabel={t('dock.closeForm')}
        closeLabel={t('dock.close')}
      />
    </>
  );
}

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { POLICY_URL, SOCIAL_LINKS } from '../home-data';
import { Icon } from './icon-sprite';

/** Footer of the wafiservices portal (ported from home.blade.php), shared by the homepage and /services. */
export async function SiteFooter() {
  const tl = await getTranslations('Layout');
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand">
            <img src="/images/logo.png" alt="" />
          </Link>
          <p style={{ margin: 0, maxWidth: '34ch' }}>{tl('footer_tagline')}</p>
        </div>
        <div>
          <h3>
            <Link href="/services">{tl('nav_services')}</Link>
          </h3>
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
  );
}

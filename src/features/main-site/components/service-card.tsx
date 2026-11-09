import { Link } from '@/i18n/navigation';
import type { PortalService } from '../home-data';
import { Icon } from './icon-sprite';

/** Splits "Name (Suffix)" into its parts, like home.blade.php. */
function splitName(name: string): [string, string | null] {
  const match = name.match(/^(.*?)\s*\(([^)]+)\)$/u);
  return match ? [match[1] ?? name, `(${match[2]})`] : [name, null];
}

interface ServiceCardProps {
  service: PortalService;
  name: string;
  description: string;
  requirementsLabel: string;
  requirements: string;
  cta: string;
}

/** One service card (the old homepage "service" card markup; styles in styles/home.css). */
export function ServiceCard({ service, name, description, requirementsLabel, requirements, cta }: ServiceCardProps) {
  const [nameMain, nameSuffix] = splitName(name);
  return (
    <article id={`service-${service.id}`} className={`service${service.wide ? ' wide' : ''}`} data-reveal="">
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
        <p>{description}</p>
        <div className="service-requirements">
          {requirementsLabel} {requirements}
        </div>
        <Link href={service.href} className="service-link">
          {cta}
          <Icon name="arrow" />
        </Link>
      </div>
      {service.art && <img className="service-art" src={service.art} alt="" loading="lazy" />}
    </article>
  );
}

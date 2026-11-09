import type { ServiceManifest } from '@/lib/services/manifest';
import { manifest as refund } from '@/features/refund/manifest';
import { manifest as resale } from '@/features/resale/manifest';
import { manifest as xleader } from '@/features/xleader/manifest';
import { manifest as customerSupportRequest } from '@/features/customer-support-request/manifest';
import { manifest as protection } from '@/features/protection/manifest';
import { manifest as followerGifts } from '@/features/follower-gifts/manifest';
import { manifest as ovfle } from '@/features/ovfle/manifest';

/**
 * Every service on the platform. Adding a service = one import + one entry here.
 */
export const services: readonly ServiceManifest[] = [
  refund,
  resale,
  xleader,
  customerSupportRequest,
  protection,
  followerGifts,
  ovfle,
];

export const enabledServices = services.filter((service) => service.enabled);

export function getService(slug: string): ServiceManifest | undefined {
  return services.find((service) => service.slug === slug);
}

import { defineService } from '@/lib/services/manifest';

// Ported from wafi-service (config/wafi_services.php). Messages namespace: "FollowerGifts".
export const manifest = defineService({
  slug: 'follower-gifts',
  name: {"ar":"هدايا المتابعين","en":"Follower Gifts"},
  description: {"ar":"هدايا المتابعين","en":"Follower Gifts"},
  accentColor: '#025197',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

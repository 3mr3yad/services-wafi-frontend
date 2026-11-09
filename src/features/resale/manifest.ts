import { defineService } from '@/lib/services/manifest';

// Ported from wafi-service (config/wafi_services.php). Messages namespace: "Resale".
export const manifest = defineService({
  slug: 'resale',
  name: {"ar":"استبدال الأجهزة","en":"Device Trade-In"},
  description: {"ar":"قيّم جهازك الحالي واستبدله بجهاز أحدث بطريقة واضحة ومباشرة.","en":"Get your current device valued and trade it in for a newer one, clearly and directly."},
  accentColor: '#1998cc',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

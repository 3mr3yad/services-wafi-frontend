import { defineService } from '@/lib/services/manifest';

// Ported from wafi-service (config/wafi_services.php). Messages namespace: "Xleader".
export const manifest = defineService({
  slug: 'xleader',
  name: {"ar":"ضمان الحماية الشاملة","en":"Full Protection Warranty"},
  description: {"ar":"فعّل ووثّق حماية جهازك واستفد من التغطية المتاحة وفق الشروط.","en":"Activate and register your device protection and benefit from the available coverage under the terms."},
  accentColor: '#023f76',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

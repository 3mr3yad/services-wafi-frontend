import { defineService } from '@/lib/services/manifest';

// Ported from wafi-service (config/wafi_services.php). Messages namespace: "Protection".
export const manifest = defineService({
  slug: 'protection',
  name: {"ar":"باقات الحماية","en":"Protection Packages"},
  description: {"ar":"باقات حماية للأجهزة الإلكترونية تمنحك خيارات إضافية وراحة أكبر بعد الشراء.","en":"Protection packages for electronic devices, giving you extra options and peace of mind after purchase."},
  accentColor: '#2fb6e9',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

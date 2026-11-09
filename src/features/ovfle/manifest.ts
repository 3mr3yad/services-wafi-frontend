import { defineService } from '@/lib/services/manifest';

// Ported from wafi-service (config/wafi_services.php → 'ovfle'). Messages namespace: "Ovfle".
export const manifest = defineService({
  slug: 'ovfle',
  name: { ar: 'تقسيط الجوالات والسيارات (اوفل)', en: 'Phone & Car Installments (Ovfle)' },
  description: {
    ar: 'قدّم طلب تقسيط لجوالك أو سيارتك واحصل على عرض تمويل مناسب.',
    en: 'Submit an installment-financing request for your phone or car and get a suitable offer.',
  },
  accentColor: '#1998cc',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

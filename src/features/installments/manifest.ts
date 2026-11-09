import { defineService } from '@/lib/services/manifest';

// Ovfle — car + smartphone installments brand. Backend service: wafi-service "ovfle" public API.
// Messages namespace: "Installments". Brand name / attribution live in ./brand.ts.
export const manifest = defineService({
  slug: 'installments',
  name: { ar: 'أوفل: تقسيط السيارات والجوالات', en: 'Ovfle: Car & Smartphone Installments' },
  description: {
    ar: 'قدّم طلب تقسيط سيارتك أو جوالك من مكان واحد، وتابع حالة طلبك برقم جوالك.',
    en: 'Apply for car or smartphone installments in one place and track your request with your mobile number.',
  },
  accentColor: '#7DE6EE',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

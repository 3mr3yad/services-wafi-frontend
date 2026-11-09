import { defineService } from '@/lib/services/manifest';

// Ported from wafi-service (config/wafi_services.php). Messages namespace: "Refund".
export const manifest = defineService({
  slug: 'refund',
  name: {"ar":"إرجاع القسيمة الشرائية","en":"Voucher Cancellation"},
  description: {"ar":"قدّم طلب إرجاع القسيمة وأرفق المستندات المطلوبة لمتابعة الإجراء.","en":"Submit a voucher cancellation request and attach the required documents to follow up."},
  accentColor: '#025197',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

import { defineService } from '@/lib/services/manifest';

// Ported from wafi-service (config/wafi_services.php). Messages namespace: "CustomerSupport".
export const manifest = defineService({
  slug: 'customer-support-request',
  name: {"ar":"الدعم الفني","en":"Support"},
  description: {"ar":"استفسارات عامة، بلاغات، متابعة طلبات ودعم من فريق متخصص.","en":"General inquiries, reports, request follow-up, and support from a dedicated team."},
  accentColor: '#1998cc',
  enabled: true,
  access: { requiresAuth: false },
  loadMessages: (locale) => import(`./messages/${locale}.json`).then((m: { default: Record<string, unknown> }) => m.default),
});

// Static lists/rules ported from the old page. Safe to import from client components (no zod).
/** CustomerSupportRequest::ISSUE_TYPES (static list in the old model; values are submitted as-is, in Arabic). */
export const ISSUE_TYPES = [
  'استفسار عام',
  'خدمة الغاء الطلب',
  'خدمة ارجاع الطلب',
  'خدمة استبدال الطلب',
  'خدمات الضمان',
  'الشحن والتوصيل',
  'اشتباه / بلاغ احتيال',
  'استعلام عن الفوترة',
  // Ovfle (installments brand) categories — keep in sync with CustomerSupportRequest::ISSUE_TYPES (Laravel).
  'البيع النقدي (أوفل)',
  'تقسيط السيارات (أوفل)',
] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];

/** Order number is optional only for this issue type (required_unless:issue_type,استفسار عام). */
export const GENERAL_INQUIRY: IssueType = 'استفسار عام';
/** Issue type that switches the description placeholder. */
export const SHIPPING: IssueType = 'الشحن والتوصيل';

/** Same regex as the backend's customer_phone rule. */
export const E164_REGEX = /^\+[1-9]\d{7,14}$/;

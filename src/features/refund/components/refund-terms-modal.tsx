'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const linkClass = 'font-semibold text-brand-600 underline hover:text-brand-700';

/** Voucher cancellation terms modal, ported from partials/public/refund-terms-modal.blade.php (texts are Arabic-only there too). */
export function RefundTermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('Refund');
  const tp = useTranslations('Portal');

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id="refundTermsModal" className="fixed inset-0 z-50" aria-hidden="false" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="wafi-animate-pop w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M9 12h6M12 9v6M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                  </svg>
                </span>
                <span className="font-bold">{t('terms_title')}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-slate-600">
            <div>
              <h3 className="mb-1.5 font-bold text-slate-900">إرجاع الطلب بعد رفعه للجهة التمويلية واعتماده</h3>
              <p>
                يمكن رفع طلب إرجاع القسيمة الشرائية خلال مدة لا تتجاوز 72 ساعة من استخدام القسيمة الشرائية، وبعد ذلك لن يتم قبول أي طلب وفق
                الشروط والأحكام.
              </p>
            </div>

            <p>
              وفي حال طلب العميل من المتجر رفع طلب إرجاع القسيمة الشرائية بعد صدور موافقة جهة التمويل، يحق للمتجر خصم الرسوم الإدارية الفعلية
              المترتبة على معالجة الطلب والتنسيق مع جهة التمويل، وذلك وفق التكاليف الفعلية، على ألا تتجاوز هذه الرسوم 25% من قيمة الطلب وبحد
              أقصى 1,899 ريالًا.
            </p>

            <div>
              <h3 className="mb-1.5 font-bold text-slate-900">وتشمل هذه الرسوم</h3>
              <ul className="list-disc space-y-1 ps-5">
                <li>فتح ملف مطالبة لاسترجاع قسيمة شرائية داخلية تم استخدامها لدى عالم وافي.</li>
                <li>تكاليف تجهيز الطلب، بما في ذلك الحجز المسبق مع الوكلاء والمناديب ورسوم تجهيز الشحنة.</li>
                <li>الوقت والجهد وخدمة معالجة الطلب مع الجهات التمويلية.</li>
                <li>تذبذب سعر المنتج بين وقت إنشاء الطلب ووقت طلب الإرجاع لدى الجهة التمويلية.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-1.5 font-bold text-slate-900">ملاحظات مهمة</h3>
              <ul className="list-disc space-y-2 ps-5">
                <li>
                  هذه الرسوم ليست غرامة، ولا علاقة لها بمبلغ التمويل، وإنما هي رسوم خدمة ثابتة، ولا تُفرض أي رسوم في حال عدم الموافقة على الطلب
                  من الجهة التمويلية.
                </li>
                <li>
                  يتم الإرجاع وفق سياسات الجهة التمويلية، على أن تتم إعادة المنتج بحالته السليمة والصحيحة، ودون فتحه أو وجود أي علامات تدل على
                  استخدامه أو الانتفاع به. ويقوم العميل بإعادة المنتج إلى شركة عالم وافي، وبعد استلامه يتم فحصه والتأكد من عدم وجود أي من الحالات
                  المستثناة التي قد يترتب عليها رفض الإرجاع.
                </li>
                <li>
                  تلتزم شركة عالم وافي بالشفافية التامة وإيضاح الرسوم للعميل قبل إكمال الطلب، وذلك من خلال السياسات المنشورة عبر منصاتها الرسمية:
                  <ul className="mt-1 list-disc space-y-0.5 ps-5">
                    <li>
                      <a href="https://wafii.sa" target="_blank" rel="noopener noreferrer" className={linkClass}>
                        wafii.sa
                      </a>
                    </li>
                    <li>
                      <a href="https://wafi4.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                        Wafi4.com
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  المتجر ليس جهة تمويل، ولا يملك الصلاحية القانونية لإرجاع الطلبات المعتمدة من الجهات التمويلية إلا بعد التنسيق مع الشركة
                  التمويلية، ورفع طلب عبر القسم المختص وسداد رسوم الخدمة.
                </li>
                <li>يلتزم العميل برفع طلب إرجاع لدى الشركة التمويلية بهدف إرجاع عقد التمويل والسند التنفيذي.</li>
                <li>يلتزم العميل برفع طلب إرجاع لدى شركة عالم وافي بغرض إرجاع القسيمة الشرائية بعد استخدامها.</li>
                <li>رفع الطلب لدى عالم وافي لا يُلزم الشركة بإرجاع العقد والسند التنفيذي، وإنما يتعلق بإرجاع القسيمة الشرائية فقط.</li>
                <li>عند إكمال الطلب، يتم إشعار عالم وافي من قِبل الشركة التمويلية بالموافقة على إرجاع العقد والسند والمدة اللازمة للمعالجة.</li>
                <li>
                  يكتمل الطلب عند اكتمال جميع أركانه، والتي تشمل رفع طلب الخدمة، وسداد رسومها الثابتة، والموافقة على إرجاع القسيمة الشرائية، وموافقة
                  الجهة التمويلية على إرجاع العقد والسند التنفيذي.
                </li>
                <li>يتم إرسال فاتورة الخدمة إلى العميل بعد السداد خلال مدة 24 ساعة.</li>
                <li>يتم إرجاع رسوم الخدمة إلى العميل في حال عدم موافقة الشركة التمويلية على الإرجاع.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              {tp('ok')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

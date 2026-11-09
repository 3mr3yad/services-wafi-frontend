'use client';

import { useTranslations } from 'next-intl';
import { TERMS_PDF_FILENAME, TERMS_PDF_URL } from './terms';
import { useEscape } from './use-escape';

const h3 = 'mb-1.5 font-bold text-slate-900';
const ul = 'list-disc space-y-1 ps-5';

/**
 * Warranty activation terms modal, ported from partials/public/xleader-terms-modal.blade.php.
 * The policy text is hard-coded Arabic in the old partial (shown in both languages), kept as-is.
 */
export function XleaderTermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('Xleader');
  const tp = useTranslations('Portal');
  useEscape(open, onClose);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'hidden'}`} aria-hidden={!open} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="wafi-animate-pop w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
          <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span className="font-bold">{t('terms_modal_title')}</span>
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
            <p>
              توضح هذه السياسة شروط تفعيل الضمان والاستفادة من التعويض لباقات الحماية بليكس BLIX 10 في 1 وإكس ليدر X-LEADER ECO 6 في 1
              لدى شركة عالم وافي. ويخضع قبول طلب التفعيل والتعويض لاستيفاء الشروط الواردة أدناه ومراجعة الشركة.
            </p>

            <div>
              <h3 className={h3}>أولًا: الباقات المشمولة بالسياسة</h3>
              <ul className={ul}>
                <li>باقة بليكس BLIX 10 في 1.</li>
                <li>باقة إكس ليدر X-LEADER ECO 6 في 1.</li>
              </ul>
              <p className="mt-1.5">
                يجب تسجيل اسم الباقة وطراز الجهاز المتوافق معها، وتوثيق تركيب ملحقات الحماية المطلوبة، بما يشمل حماية الشاشة الأمامية والجهة
                الخلفية والكاميرا والكفر، بحسب محتويات كل باقة.
              </p>
            </div>

            <div>
              <h3 className={h3}>ثانيًا: شروط الشراء والتسجيل</h3>
              <ul className={ul}>
                <li>يجب شراء الباقة من عالم وافي أو أحد الوكلاء أو منافذ البيع أو المتاجر الإلكترونية المعتمدة لدى الشركة.</li>
                <li>
                  يجب أن تتضمن فاتورة الشراء اسم الباقة وتاريخ الشراء ومبلغ المنتج البالغ 249 ريالًا بشكل واضح. ولا تُقبل الفاتورة التي لا تتضمن
                  المبلغ المحدد لغرض الضمان.
                </li>
                <li>يجب تقديم طلب تفعيل الضمان خلال 7 أيام من تاريخ الشراء عبر الموقع الإلكتروني الرسمي لعالم وافي.</li>
                <li>يجب رفع صورة واضحة لفاتورة الشراء، واستكمال بيانات العميل والجهاز، بما فيها طراز الجهاز ورقمه التسلسلي وبيانات التواصل.</li>
                <li>لا يُقبل الطلب في حال نقص البيانات أو عدم وضوح المستندات المطلوبة.</li>
                <li>لا يُعتد بتسجيل الضمان عبر مواقع أخرى أو لدى الموزعين؛ إذ يجب تقديم الطلب عبر الموقع الرسمي لعالم وافي.</li>
                <li>يخضع الطلب للمراجعة، ولا يُعد إرسال البيانات موافقة نهائية على التفعيل. ويُبلَّغ العميل بنتيجة الطلب عبر بيانات التواصل المسجلة.</li>
              </ul>
            </div>

            <div>
              <h3 className={h3}>ثالثًا: شروط تركيب الحماية</h3>
              <ul className={ul}>
                <li>يجب تركيب ملحقات الحماية بطريقة صحيحة لدى جهة معتمدة من شركة عالم وافي.</li>
                <li>يُرفض طلب الضمان عند التركيب الخاطئ أو تركيب الباقة لدى متجر غير معتمد.</li>
                <li>يجب إرفاق صور واضحة للجهاز بعد التركيب تُظهر ملحقات الحماية الأساسية الخاصة بالباقة.</li>
                <li>وجود ملحقات الحماية المطلوبة على الجهاز شرط أساسي للاستفادة من الضمان أو التعويض.</li>
              </ul>
            </div>

            <div>
              <h3 className={h3}>رابعًا: مدة الضمان ونطاق التغطية</h3>
              <ul className={ul}>
                <li>يسري الضمان لمدة سنة واحدة من تاريخ الشراء، بشرط قبول طلب التفعيل.</li>
                <li>تشمل التغطية كسر الشاشة الأمامية وكسر خلفية الجهاز فقط، وفق حدود التعويض والشروط الواردة في هذه السياسة.</li>
                <li>يُقدَّم التعويض مرة واحدة فقط خلال سنة الضمان.</li>
                <li>لا تشمل هذه الخدمة أجهزة الآيباد أو الساعات أو السماعات.</li>
                <li>تفعيل الضمان لا يعني الموافقة المسبقة على أي مطالبة؛ إذ تخضع كل مطالبة للفحص والمراجعة.</li>
              </ul>
            </div>

            <div>
              <h3 className={h3}>خامسًا: حدود التعويض والمزايا</h3>
              <p className="mb-2">لهواتف آيفون 17 وآيفون 18 وسامسونج S26، يصل إجمالي التعويض والمزايا إلى 2500 ريال سعودي، موزعًا على النحو التالي:</p>
              <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5">
                  <span>كسر الشاشة الأمامية</span>
                  <span className="font-bold text-slate-900">1000 ر.س</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span>كسر خلفية الجهاز</span>
                  <span className="font-bold text-slate-900">500 ر.س</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5">
                  <span>استبدال باقة الحماية بباقة أخرى</span>
                  <span className="font-bold text-slate-900">1000 ر.س</span>
                </div>
                <div className="flex items-center justify-between bg-brand-50 px-4 py-2.5">
                  <span className="font-bold text-brand-800">إجمالي التعويض والمزايا</span>
                  <span className="font-bold text-brand-800">حتى 2500 ر.س</span>
                </div>
              </div>
              <p className="mt-1.5">تخضع الاستفادة من التعويض والمزايا لاستيفاء الشروط، واجتياز الفحص، واعتماد المطالبة من شركة عالم وافي.</p>
            </div>

            <div>
              <h3 className={h3}>سادسًا: الحالات غير المشمولة بالضمان</h3>
              <p className="mb-1.5">لا يشمل الضمان التلف أو الكسر الناتج عن سوء الاستخدام، بما في ذلك:</p>
              <ul className={ul}>
                <li>سقوط الجهاز في الماء أو تعرضه لأضرار ناتجة عن السوائل.</li>
                <li>الصدمات شديدة الضرر.</li>
                <li>ثني الجهاز من قبل المستخدم.</li>
                <li>أي تلف أو خلل ناتج عن سوء الاستخدام.</li>
              </ul>
              <p className="mt-1.5">كما لا تُقبل المطالبة عند عدم استيفاء شروط الشراء أو التسجيل أو التركيب، أو إزالة الحماية المطلوبة قبل فحص الجهاز.</p>
            </div>

            <div>
              <h3 className={h3}>سابعًا: إجراءات تقديم طلب التعويض</h3>
              <ul className={ul}>
                <li>تقديم طلب التعويض عبر الموقع الإلكتروني الرسمي لعالم وافي، والتواصل مع خدمة العملاء المعتمدة.</li>
                <li>إرفاق فاتورة الشراء، وبيانات تسجيل الضمان، والرقم التسلسلي للجهاز، وصور الضرر والمستندات المطلوبة.</li>
                <li>إبقاء ملحقات الحماية على الجهاز لحين استكمال الفحص.</li>
                <li>عدم إزالة حماية الشاشة الأمامية عند حدوث الكسر؛ إذ يسقط حق المطالبة بالتعويض عند إزالتها، وفق شروط هذه الخدمة.</li>
                <li>استكمال إجراءات الفحص الأولي للتحقق من الضرر وسلامة التركيب واستيفاء شروط التغطية.</li>
                <li>انتظار إشعار الشركة بقبول المطالبة أو رفضها بعد المراجعة.</li>
              </ul>
            </div>

            <div>
              <h3 className={h3}>ثامنًا: مدة تنفيذ التعويض وآليته</h3>
              <ul className={ul}>
                <li>يُنفَّذ التعويض خلال مدة أقصاها 15 يوم عمل بعد اجتياز الفحص واعتماد المطالبة واستكمال المتطلبات.</li>
                <li>ويتم التعويض عن طريق الموزعين المعتمدين بعد مراجعة شركة عالم وافي، أو بالتحويل إلى حساب العميل، وفق الإجراء المعتمد للمطالبة.</li>
              </ul>
            </div>

            <div>
              <h3 className={h3}>تاسعًا: الموافقة على السياسة وتحديثها</h3>
              <p>بتقديم طلب تفعيل الضمان، يقر العميل بصحة البيانات والمستندات المقدمة، وباطلاعه على شروط هذه السياسة وموافقته عليها.</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            <a
              href={TERMS_PDF_URL}
              download={TERMS_PDF_FILENAME}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M12 15V3m0 12-4-4m4 4 4-4M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
              </svg>
              {t('terms_download_pdf')}
            </a>
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import { Award, CheckCircle2, Flame, BookCheck, ShieldCheck } from 'lucide-react';

export default function Progress() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const cprDone = localStorage.getItem('completed_cpr') === 'true' ? 1 : 0;
  const chokingDone = localStorage.getItem('completed_choking') === 'true' ? 1 : 0;
  const burnsDone = localStorage.getItem('completed_burns') === 'true' ? 1 : 0;
  const totalCompleted = cprDone + chokingDone + burnsDone;
  const progressPercent = Math.round((totalCompleted / 3) * 100);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8F4FC] dark:bg-[#150D18] text-[#2C1B33] dark:text-[#F8F4FC]">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1200px]">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#3B2042] dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-[#8A6BBE]" />
            <span>{isAr ? 'تقدمي الأكاديمي والإنجازات' : 'My Learning Progress'}</span>
          </h1>
          <p className="text-xs text-[#796882] dark:text-gray-300">
            {isAr ? 'سجل متابعة إكمال المساقات والأوسمة المكتسبة في مجال الإسعاف الأولية.' : 'Track your completed courses and badges earned in emergency response.'}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white dark:bg-[#211526] rounded-3xl border border-[#EFE8F4] dark:border-[#35213D] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-[#3B2042] dark:text-white">
              {isAr ? 'نسبة الإنجاز الكلي' : 'Overall Completion'}
            </span>
            <span className="text-sm font-black text-[#8A6BBE]">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-[#EFE8F4] dark:bg-[#35213D] rounded-full overflow-hidden">
            <div className="h-full bg-[#3B2042] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-[#3B2042] dark:text-white">
            {isAr ? 'الأوسمة والشهادات المكتسبة' : 'Earned Badges'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-3xl border ${cprDone ? 'bg-white dark:bg-[#211526] border-[#EFE8F4]' : 'bg-gray-50 opacity-50 border-dashed border-gray-300'} space-y-3`}>
              <div className="w-12 h-12 rounded-2xl bg-[#ECE0F5] text-[#3B2042] flex items-center justify-center font-bold">
                🫀
              </div>
              <h3 className="font-extrabold text-sm text-[#3B2042] dark:text-white">
                {isAr ? 'مسعف CPR معتمد' : 'Certified CPR Responder'}
              </h3>
              <p className="text-xs text-[#796882]">
                {cprDone ? (isAr ? 'تم إكمال مساق الإنعاش القلبي بنجاح ✓' : 'CPR Course Completed ✓') : (isAr ? 'أكمل الدرس لفتح الوسام' : 'Complete lesson to unlock')}
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${chokingDone ? 'bg-white dark:bg-[#211526] border-[#EFE8F4]' : 'bg-gray-50 opacity-50 border-dashed border-gray-300'} space-y-3`}>
              <div className="w-12 h-12 rounded-2xl bg-[#ECE0F5] text-[#3B2042] flex items-center justify-center font-bold">
                🫁
              </div>
              <h3 className="font-extrabold text-sm text-[#3B2042] dark:text-white">
                {isAr ? 'خبير إسعاف الاختناق' : 'Choking Relief Hero'}
              </h3>
              <p className="text-xs text-[#796882]">
                {chokingDone ? (isAr ? 'تم إكمال مساق الاختناق بنجاح ✓' : 'Choking Course Completed ✓') : (isAr ? 'أكمل الدرس لفتح الوسام' : 'Complete lesson to unlock')}
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${burnsDone ? 'bg-white dark:bg-[#211526] border-[#EFE8F4]' : 'bg-gray-50 opacity-50 border-dashed border-gray-300'} space-y-3`}>
              <div className="w-12 h-12 rounded-2xl bg-[#ECE0F5] text-[#3B2042] flex items-center justify-center font-bold">
                🩹
              </div>
              <h3 className="font-extrabold text-sm text-[#3B2042] dark:text-white">
                {isAr ? 'أخصائي الجروح والحروق' : 'Burn Care Specialist'}
              </h3>
              <p className="text-xs text-[#796882]">
                {burnsDone ? (isAr ? 'تم إكمال مساق الحروق بنجاح ✓' : 'Burn Care Completed ✓') : (isAr ? 'أكمل الدرس لفتح الوسام' : 'Complete lesson to unlock')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
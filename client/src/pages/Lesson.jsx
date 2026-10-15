import React, { useState } from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, HelpCircle, ShieldAlert, FileText } from 'lucide-react';

export default function Lesson() {
  const [lang, setLang] = useState('ar');
  const [isCompleted, setIsCompleted] = useState(false);

  // عينة لدرس تفاعلي (سيتم جلبه لاحقاً من قاعدة البيانات حسب كل درس)
  const sampleLesson = {
    title: {
      ar: 'خطوات الإنعاش القلبي الرئوي الأساسية (CPR)',
      en: 'Basic Cardiopulmonary Resuscitation (CPR) Steps'
    },
    objectives: {
      ar: [
        'معرفة متى يجب تطبيق الإنعاش القلبي الرئوي.',
        'إتقان تقنية الضغطات الصدرية بالعمق والإيقاع الصحيح.',
        'تأمين مجرى التنفس وفتح المسالك الهوائية.'
      ],
      en: [
        'Understand when to initiate CPR.',
        'Master chest compression depth and rhythm.',
        'Secure and open the airway properly.'
      ]
    },
    content: {
      ar: `الإنعاش القلبي الرئوي (CPR) هو إجراء طارئ منقذ للحياة يُستخدم عندما يتوقف قلب الشخص عن الخفقان. تتضمن الخطوات الأساسية تقييم استجابة المصاب، طلب المساعدة الطبية فوراً، ثم البدء بالضغطات الصدرية بمعدل 100 إلى 120 ضغطة في الدقيقة بعمق لا يقل عن 5 سم للبالغين.`,
      en: `Cardiopulmonary Resuscitation (CPR) is a life-saving emergency procedure performed when someone's heart stops beating. Key steps include checking responsiveness, calling for emergency help immediately, and initiating chest compressions at a rate of 100-120 per minute.`
    },
    safetyNotes: {
      ar: 'تحذير طبي: لا تقم بتحريك المصاب إذا كان يشتبه في إصابة في العمود الفقري إلا في حال وجود خطر مميت يهدد حياته.',
      en: 'Medical Warning: Do not move the victim if a spinal injury is suspected unless there is an immediate life-threatening hazard.'
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80'
  };

  const handleCompleteLesson = () => {
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-cream-light dark:bg-cream-dark py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb / Header info */}
        <div className="flex items-center justify-between bg-white dark:bg-cream-darkCard p-4 rounded-2xl border border-cream dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 text-burgundy dark:text-cream font-bold text-sm">
            <BookOpen className="w-5 h-5 text-medicalRed" />
            <span>{lang === 'ar' ? 'مساق الإنعاش القلبي الرئوي' : 'CPR Course'}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 font-normal">{lang === 'ar' ? 'الدرس الأول' : 'Lesson 1'}</span>
          </div>
          
          {/* Language Toggle Preview */}
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-3 py-1 rounded-lg bg-cream dark:bg-gray-800 text-burgundy dark:text-cream text-xs font-bold"
          >
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>

        {/* Lesson Title & Main Card */}
        <div className="bg-white dark:bg-cream-darkCard border border-cream dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-10 space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-burgundy dark:text-cream">
              {sampleLesson.title[lang]}
            </h1>
          </div>

          {/* Featured Lesson Image */}
          <div className="rounded-2xl overflow-hidden shadow-md max-h-96">
            <img 
              src={sampleLesson.image} 
              alt="Lesson Visual" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Learning Objectives Box */}
          <div className="p-6 rounded-2xl bg-cream/50 dark:bg-gray-800/50 border border-cream dark:border-gray-700 space-y-3">
            <h3 className="text-lg font-bold text-burgundy dark:text-cream flex items-center gap-2">
              <FileText className="w-5 h-5 text-medicalRed" />
              {lang === 'ar' ? 'أهداف التعلم في هذا الدرس' : 'Learning Objectives'}
            </h3>
            <ul className="space-y-2">
              {sampleLesson.objectives[lang].map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                  <span className="w-2 h-2 rounded-full bg-medicalRed mt-2 shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <p>{sampleLesson.content[lang]}</p>
          </div>

          {/* Safety Warning Box */}
          <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-medicalRed/30 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-medicalRed shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-medicalRed">
                {lang === 'ar' ? 'تنبيه سلامة طبي هام' : 'Important Medical Safety Notice'}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {sampleLesson.safetyNotes[lang]}
              </p>
            </div>
          </div>

          {/* Completion & Navigation Footer */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <button
              onClick={handleCompleteLesson}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                isCompleted 
                  ? 'bg-green-600 text-white' 
                  : 'bg-burgundy hover:bg-burgundy-hover text-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {isCompleted 
                ? (lang === 'ar' ? '✓ تم إتمام الدرس' : '✓ Lesson Completed') 
                : (lang === 'ar' ? 'تحديد كمنجز' : 'Mark as Completed')}
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-burgundy text-burgundy dark:text-cream font-semibold hover:bg-burgundy/10 transition-colors">
                {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{lang === 'ar' ? 'الدرس السابق' : 'Previous'}</span>
              </button>
              
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-burgundy hover:bg-burgundy-hover text-white font-bold transition-colors">
                <span>{lang === 'ar' ? 'الاختبار التفاعلي' : 'Take Quiz'}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
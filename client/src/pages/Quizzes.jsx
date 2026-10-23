import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import { HelpCircle, CheckCircle2, XCircle, Award, RefreshCw } from 'lucide-react';

export default function Quizzes() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: isAr ? "ما هو المعدل الصحيح للضغطات الصدرية أثناء الإنعاش القلبي الرئوي (CPR)؟" : "What is the correct rate for chest compressions during CPR?",
      options: [
        isAr ? "60 - 80 ضغطة في الدقيقة" : "60 - 80 compressions per minute",
        isAr ? "100 - 120 ضغطة في الدقيقة" : "100 - 120 compressions per minute",
        isAr ? "140 - 160 ضغطة في الدقيقة" : "140 - 160 compressions per minute"
      ],
      correct: 1
    },
    {
      question: isAr ? "ما هو الإجراء الأول الصحيح عند التعامل مع شخص يغص ويتعذر عليه التنفس؟" : "What is the first step when aiding a conscious choking adult?",
      options: [
        isAr ? "إعطاؤه الماء فوراً" : "Give them water immediately",
        isAr ? "تطبيق 5 ضربات على الظهر و5 ضغطات على البطن" : "Perform 5 back blows and 5 abdominal thrusts",
        isAr ? "جعله يستلقي على ظهره" : "Lay them flat on their back"
      ],
      correct: 1
    },
    {
      question: isAr ? "كيف يجب التعامل مع الحروق البسيطة من الدرجة الأولى؟" : "How should you treat a minor first-degree burn?",
      options: [
        isAr ? "وضع الثلج المباشر على الحرق" : "Apply ice directly to the burn",
        isAr ? "تبريد مكان الحرق بالماء الفاتر المنساب لمدة 10-15 دقيقة" : "Cool under cool running water for 10-15 minutes",
        isAr ? "دهن مكان الحرق بالمعجون" : "Apply toothpaste to the burn"
      ],
      correct: 1
    }
  ];

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8F4FC] dark:bg-[#150D18] text-[#2C1B33] dark:text-[#F8F4FC]">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1000px] mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#3B2042] dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#8A6BBE]" />
            <span>{isAr ? 'اختبار الإسعافات الأولية' : 'First Aid Knowledge Quiz'}</span>
          </h1>
          <p className="text-xs text-[#796882] dark:text-gray-300">
            {isAr ? 'اختبر معلوماتك الطبية وتأكد من جاهزيتك للتعامل مع الحالات الطارئة.' : 'Test your medical skills and evaluate your readiness for emergencies.'}
          </p>
        </div>

        {!showResult ? (
          <div className="bg-white dark:bg-[#211526] rounded-3xl border border-[#EFE8F4] dark:border-[#35213D] p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center text-xs font-bold text-[#796882]">
              <span>{isAr ? `السؤال ${currentQuestion + 1} من ${questions.length}` : `Question ${currentQuestion + 1} of ${questions.length}`}</span>
              <span className="px-3 py-1 bg-[#ECE0F5] dark:bg-[#35213D] text-[#3B2042] dark:text-[#B99AE8] rounded-full">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-[#3B2042] dark:text-white">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => {
                let btnStyle = "bg-[#F9F6FC] dark:bg-[#1B1020] border-[#EFE8F4] dark:border-[#35213D]";
                if (selectedOption !== null) {
                  if (idx === questions[currentQuestion].correct) {
                    btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-300";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl text-xs font-bold text-start transition-all border ${btnStyle}`}
                  >
                    {idx + 1}. {option}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-[#3B2042] text-white font-bold text-xs hover:bg-[#2A1630]"
                >
                  {currentQuestion < questions.length - 1 ? (isAr ? 'السؤال التالي ←' : 'Next Question →') : (isAr ? 'عرض النتيجة' : 'See Results')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#211526] rounded-3xl border border-[#EFE8F4] dark:border-[#35213D] p-8 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#ECE0F5] dark:bg-[#35213D] text-[#8A6BBE] mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#3B2042] dark:text-white">
              {isAr ? 'نتيجة الاختبار' : 'Quiz Completed!'}
            </h2>
            <p className="text-sm font-bold text-[#796882]">
              {isAr ? `حصلت على ${score} من أصل ${questions.length} إجابات صحيحة` : `You scored ${score} out of ${questions.length}`}
            </p>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B2042] text-white font-bold text-xs hover:bg-[#2A1630]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isAr ? 'إعادة الاختبار' : 'Retake Quiz'}</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
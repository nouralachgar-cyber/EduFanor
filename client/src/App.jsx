import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Courses from './pages/Courses';
import Lesson from './pages/Lesson';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import AITutor from './pages/AITutor';
import Dashboard from './pages/Dashboard';
import { ShieldAlert, HeartPulse, BookOpen, Bot, ArrowLeft } from 'lucide-react';

// مكون الصفحة الرئيسية (HomePage)
function Home() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-16 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy/10 text-burgundy dark:text-cream font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-medicalRed" />
          <span>{t('hero.badge', 'منصة الإسعافات الأولية الأكاديمية الأولى')}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-burgundy dark:text-cream tracking-tight leading-tight">
          {t('hero.titleMain', 'تعلم كيف تنقذ حياة')}<br />
          <span className="text-medicalRed">{t('hero.titleSub', 'بأسلوب أكاديمي تفاعلي')}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          {t('hero.description', 'منصة EduFanor تقدم دورات موثوقة في الإسعافات الأولية، اختبارات تفاعلية، ومساعد ذكاء اصطناعي لدعمك في حالات الطوارئ والتعلم.')}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/courses"
            className="px-8 py-3.5 rounded-xl bg-burgundy hover:bg-burgundy-hover text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>{t('hero.btnExplore', 'استكشف المساقات')}</span>
            <ArrowLeft className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
          </Link>
          <Link
            to="/settings"
            className="px-8 py-3.5 rounded-xl border-2 border-burgundy text-burgundy dark:text-cream font-bold hover:bg-burgundy/10 transition-all"
          >
            {t('hero.btnSettings', 'الإعدادات واللغات')}
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-cream-darkCard border border-cream dark:border-gray-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy/10 text-burgundy dark:text-cream flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-medicalRed" />
          </div>
          <h3 className="text-xl font-bold text-burgundy dark:text-cream">دروس أكاديمية</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">شروحات خطوة بخطوة مع تدابير السلامة الطبية المعتمدة.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-cream-darkCard border border-cream dark:border-gray-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy/10 text-burgundy dark:text-cream flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-medicalRed" />
          </div>
          <h3 className="text-xl font-bold text-burgundy dark:text-cream">اختبارات تفاعلية</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">تقييم شامل لفهمك وتأكيد اكتسابك للمهارات الإسعافية.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-cream-darkCard border border-cream dark:border-gray-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy/10 text-burgundy dark:text-cream flex items-center justify-center">
            <Bot className="w-6 h-6 text-medicalRed" />
          </div>
          <h3 className="text-xl font-bold text-burgundy dark:text-cream">مساعد ذكي</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">استجابة فورية واستفسارات مدعومة بالذكاء الاصطناعي مع Grok.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#1a1214] text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
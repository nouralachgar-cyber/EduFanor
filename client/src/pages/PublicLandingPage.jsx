import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldAlert, Globe, Sun, Moon, ArrowRight, ArrowLeft, 
  Bot, BookOpen, HelpCircle, Play, TrendingUp,
  Mail, Phone, ShieldCheck, Send
} from 'lucide-react';
import GlobalEmergencySection from '../components/GlobalEmergencySection';
import { PixelImage } from '../components/PixelImage';
import { AnimatedGridPattern } from '../components/AnimatedGridPattern';
import { Text3DFlip } from '../components/Text3DFlip';

export default function PublicLandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isAr = i18n.language === 'ar';
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isAr, i18n.language]);

  const toggleLanguage = () => i18n.changeLanguage(isAr ? 'en' : 'ar');
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <div className="relative min-h-screen bg-[#FCFAFF] dark:bg-[#17121D] text-[#1F142E] dark:text-[#F8F4FC] font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* 🌟 Animated Grid Background Effect */}
      <AnimatedGridPattern
        numSquares={35}
        maxOpacity={0.12}
        duration={3}
        className="[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)] inset-x-0 inset-y-0 h-full w-full skew-y-12"
      />

      {/* 🌐 Navbar الرئيسي */}
      <header className="sticky top-0 z-50 bg-[#FCFAFF]/95 dark:bg-[#17121D]/95 backdrop-blur-md border-b border-[#EDE6F5] dark:border-[#2B2037] px-6 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/edufanor.png"
              alt="EduFanor Logo"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-xs font-extrabold text-[#6B5E7C] dark:text-[#C9BED5]">
          <a href="#home" className="hover:text-[#49305D] dark:hover:text-white transition-colors">{isAr ? 'الرئيسية' : 'Home'}</a>
          <a href="#about" className="hover:text-[#49305D] dark:hover:text-white transition-colors">{isAr ? 'عن المنصة' : 'About'}</a>
          <a href="#features" className="hover:text-[#49305D] dark:hover:text-white transition-colors">{isAr ? 'المميزات' : 'Features'}</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage} 
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4EFFB] dark:bg-[#21192B] text-xs font-extrabold text-[#49305D] dark:text-[#F8F4FC] cursor-pointer hover:bg-[#E9E0F5] transition-colors"
          >
            <Globe className="w-4 h-4 text-[#8A6BBE]" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full bg-[#F4EFFB] dark:bg-[#21192B] text-[#49305D] dark:text-[#F8F4FC] cursor-pointer hover:bg-[#E9E0F5] transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#8A6BBE]" />}
          </button>

          <Link 
            to="/login" 
            className="px-5 py-2.5 rounded-full border border-[#8A6BBE] text-[#49305D] dark:text-white font-extrabold text-xs hover:bg-[#8A6BBE]/10 transition-all"
          >
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </Link>

          <Link 
            to="/register" 
            className="px-5 py-2.5 rounded-full bg-[#49305D] hover:bg-[#39244A] text-white font-extrabold text-xs shadow-md transition-all"
          >
            {isAr ? 'حساب جديد' : 'Sign Up'}
          </Link>
        </div>
      </header>

      {/* 🚀 Hero Section */}
      <section id="home" className="relative max-w-[1700px] mx-auto px-6 lg:px-16 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden z-10">
        <div className="lg:col-span-6 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E0F5] dark:bg-[#2B2037] border border-[#8A6BBE]/30 text-xs font-bold text-[#49305D] dark:text-[#E9E0F5]">
            <ShieldAlert className="w-4 h-4 text-[#8A6BBE]" />
            <span>{isAr ? 'منصة تعليم الإسعافات الأولية' : 'First Aid Education Platform'}</span>
          </div>

          {/* 🌟 3D Flip Effect on Hero Title */}
          <div className="text-4xl sm:text-6xl font-black text-[#49305D] dark:text-white tracking-tight leading-[1.25] flex flex-col gap-2">
            <Text3DFlip textClassName="text-[#49305D] dark:text-white" flipTextClassName="text-[#8A6BBE]">
              {isAr ? 'كن مستعداً وأنقذ حياة' : 'Be Ready & Save Lives'}
            </Text3DFlip>
          </div>

          <p className="text-sm lg:text-base text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed font-medium max-w-xl">
            {isAr 
              ? 'منصة EduFanor هي بيئتك التفاعلية لتعلم الإسعافات الأولية. تعلم بخطواتك الخاصة مع مساقات احترافية، اختبارات تفاعلية، تتبع للتقدم ومساعد ذكي.'
              : 'EduFanor is an interactive first-aid learning platform with expert-led courses, quizzes, progress tracking and an AI tutor.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-full bg-[#49305D] hover:bg-[#39244A] text-white font-extrabold text-xs shadow-xl flex items-center gap-3 transition-all hover:scale-[1.02]"
            >
              <span>{isAr ? 'ابدأ مجاناً الآن' : 'Get Started Free'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>

            <a 
              href="#about" 
              className="px-7 py-4 rounded-full border border-[#8A6BBE] text-[#49305D] dark:text-white font-extrabold text-xs hover:bg-[#8A6BBE]/10 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-[#8A6BBE]" />
              <span>{isAr ? 'شاهد كيف تعمل المنصة' : 'Watch How It Works'}</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 relative flex items-center justify-center py-6 z-10">
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#8A6BBE]/40 via-[#C5A8E8]/35 to-transparent dark:from-[#8A6BBE]/30 dark:via-[#49305D]/25 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="relative w-full max-w-[760px] flex items-center justify-center">
            <img 
              src="/landing.png" 
              alt="EduFanor CPR First Aid Illustration" 
              className="w-full h-auto object-contain scale-110 md:scale-125 transition-transform duration-700 hover:scale-[1.28] filter drop-shadow-[0_30px_60px_rgba(73,48,93,0.22)] dark:drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] mix-blend-multiply dark:mix-blend-normal"
              style={{
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, rgba(0,0,0,0.5) 80%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, rgba(0,0,0,0.5) 80%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </section>

      {/* 🌟 Features Section */}
      <section id="features" className="relative z-10 bg-[#F4EFFB]/80 dark:bg-[#21192B]/80 backdrop-blur-sm py-20 px-6 lg:px-16 border-t border-b border-[#EDE6F5] dark:border-[#2B2037]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#8A6BBE]">
              {isAr ? 'لماذا EduFanor؟' : 'Why Choose Us'}
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#49305D] dark:text-white">
              {isAr ? 'ميزات متكاملة لرحلة تعلم احترافية' : 'Designed for Effective Learning'}
            </h2>
            <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5]">
              {isAr ? 'أدوات ذكية ومساقات مدروسة لتطوير مهارات الإسعافات الأولية لديك' : 'Everything you need to master first-aid awareness safely.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#493B58] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#49305D]/10 text-[#49305D] dark:text-[#E9E0F5] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#8A6BBE]" />
              </div>
              <h3 className="text-lg font-black text-[#49305D] dark:text-white">
                {isAr ? 'مساقات بإشراف الخبراء' : 'Expert-Led Courses'}
              </h3>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
                {isAr ? 'محتوى أكاديمي منظم يعلمك الاستجابة للحالات الطارئة خطوة بخطوة.' : 'Structured educational content covering first-aid awareness and basic response principles.'}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#493B58] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#49305D]/10 text-[#49305D] dark:text-[#E9E0F5] flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#8A6BBE]" />
              </div>
              <h3 className="text-lg font-black text-[#49305D] dark:text-white">
                {isAr ? 'المساعد الذكي (AI Tutor)' : 'AI Tutor'}
              </h3>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
                {isAr ? 'اطرح أسئلتك التعليمية واستفسر عما تعلمته لمراجعة المفاهيم في أي وقت.' : 'Ask educational questions and revise studied concepts with our intelligent assistant.'}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#493B58] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#49305D]/10 text-[#49305D] dark:text-[#E9E0F5] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#8A6BBE]" />
              </div>
              <h3 className="text-lg font-black text-[#49305D] dark:text-white">
                {isAr ? 'تتبع تقدمك المستمر' : 'Track Your Progress'}
              </h3>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
                {isAr ? 'راقب الدروس المكتملة، معدلات الاختبارات، ونقاط القوة والضعف لديك.' : 'Monitor your completed lessons, quiz scores, and learning progress easily.'}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#493B58] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#49305D]/10 text-[#49305D] dark:text-[#E9E0F5] flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#8A6BBE]" />
              </div>
              <h3 className="text-lg font-black text-[#49305D] dark:text-white">
                {isAr ? 'اختبارات تفاعلية' : 'Interactive Quizzes'}
              </h3>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
                {isAr ? 'قيم فهمك للمعلومات عبر اختبارات قصيرة تثبت معلوماتك الإسعافية.' : 'Test your knowledge with quizzes designed to reinforce safety awareness.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 Our Mission Section with PixelImage & Text3DFlip */}
      <section className="relative z-10 py-20 px-6 lg:px-16 bg-[#F4EFFB]/80 dark:bg-[#21192B]/80 backdrop-blur-sm border-t border-b border-[#EDE6F5] dark:border-[#3B2B4C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E0F5] dark:bg-[#2B2037] border border-[#8A6BBE]/30 text-xs font-bold text-[#49305D] dark:text-[#E9E0F5]">
              <ShieldAlert className="w-4 h-4 text-[#8A6BBE]" />
              <span>{t('mission.badge')}</span>
            </div>

            {/* 🌟 3D Flip Effect on Mission Title */}
            <div className="text-3xl lg:text-4xl font-black text-[#49305D] dark:text-white tracking-tight leading-tight">
              <Text3DFlip textClassName="text-[#49305D] dark:text-white" flipTextClassName="text-[#8A6BBE]">
                {t('mission.title')}
              </Text3DFlip>
            </div>

            <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed font-medium">
              {t('mission.desc')}
            </p>

            <div className="pt-2">
              <Link 
                to="/register" 
                className="px-7 py-3.5 rounded-full bg-[#49305D] hover:bg-[#39244A] text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>{t('mission.btn')}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>

          {/* Save Image with Pixel Effect */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-[#EDE6F5] dark:border-[#3B2B4C] bg-white dark:bg-[#17121D] p-3">
              <PixelImage
                src="/save.png"
                customGrid={{ rows: 4, cols: 6 }}
                grayscaleAnimation={true}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 🌍 3D Globe Emergency Section */}
      <div className="relative z-10">
        <GlobalEmergencySection />
      </div>

      {/* 📖 About Section */}
      <section id="about" className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#8A6BBE]">
            {isAr ? 'عن منصة EduFanor' : 'About EduFanor'}
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-[#49305D] dark:text-white">
            {isAr ? '“قليل من المعرفة يمكن أن يصنع فارقاً كبيراً.”' : '“A Little Knowledge Can Make a Difference.”'}
          </h2>
          <p className="max-w-3xl mx-auto text-sm lg:text-base text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed font-medium">
            {isAr 
              ? 'تأسست EduFanor كمرجع ومشروع تخرج أكاديمي يهدف لرفع الوعي بالإسعافات الأولية وتمكين المواطنين العاديين من تقديم المساعدة الأولية الآمنة ريثما تصل فرق الطوارئ.'
              : 'EduFanor is created to make basic first-aid knowledge more accessible, helping people learn how to respond safely while waiting for professional emergency services.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-[#F4EFFB] dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#493B58] space-y-4 shadow-sm">
            <h3 className="text-xl font-black text-[#49305D] dark:text-white">{isAr ? 'مهمتنا' : 'Our Mission'}</h3>
            <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
              {isAr 
                ? 'جعل المعرفة الأساسية للإسعافات الأولية أسهل في الوصول والفهم، لتشجيع الاستجابة الآمنة والمسؤولة في حالات الطوارئ.'
                : 'To raise awareness about first aid and make essential knowledge more accessible, helping people offer safe initial assistance.'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F4EFFB] dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#493B58] space-y-4 shadow-sm">
            <h3 className="text-xl font-black text-[#49305D] dark:text-white">{isAr ? 'رؤيتنا' : 'Our Vision'}</h3>
            <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
              {isAr 
                ? 'المساهمة في بناء مجتمع أكثر وعياً واستعداداً، يفهم أفرادُه أهمية الإسعافات الأولية ويعرفون متى وكيف يطلبون مساعدة المختصين.'
                : 'To contribute to a more informed and prepared community where more people understand the importance of first aid and emergency response.'}
            </p>
          </div>
        </div>
      </section>

      {/* 🌟 Footer الاحترافي الجديد */}
      <footer className="relative z-10 bg-[#17121D] text-[#F8F4FC] border-t border-[#2B2037] pt-16 pb-8 px-6 lg:px-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-[#2B2037]">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3 decoration-none group">
              <img
                src="/edufanor.png"
                alt="EduFanor Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl font-black text-white tracking-wide">
                EduFanor
              </span>
            </Link>

            <p className="text-xs text-[#C9BED5] leading-relaxed max-w-sm font-medium">
              {isAr
                ? 'المنصة الرقمية المتخصصة في التدريب والتوعية بالإسعافات الأولية والاستجابة الآمنة للطوارئ.'
                : 'The leading interactive digital platform for first aid training and emergency response awareness.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#21192B] border border-[#3B2B4C] text-xs font-bold text-[#8A6BBE]">
              <ShieldCheck className="w-4 h-4 text-[#8A6BBE]" />
              <span>{isAr ? 'منصة توعوية وتعليمية معتمدة' : 'Verified Educational Platform'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-[#8A6BBE]">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3 text-xs font-semibold text-[#C9BED5]">
              <li>
                <a href="#home" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{isAr ? 'المميزات' : 'Features'}</span>
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{isAr ? 'عن المنصة' : 'About Us'}</span>
                </a>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{isAr ? 'المساقات' : 'Courses'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us & Social Media */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-[#8A6BBE]">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            
            <ul className="space-y-3 text-xs text-[#C9BED5]">
              <li className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#8A6BBE]">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-semibold">support@edufanor.com</span>
              </li>

              <li className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#8A6BBE]">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-semibold" dir="ltr">+212 600 000 000</span>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-[#8C7B9E]">
                {isAr ? 'تابعنا على منصات التواصل' : 'Follow Us'}
              </span>
              <div className="flex items-center gap-3">
                {/* GitHub */}
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                {/* Twitter */}
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* Telegram */}
                <a href="https://t.me" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C7B9E] font-medium">
          <p>
            © {new Date().getFullYear()} EduFanor Platform. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              {isAr ? 'حساب جديد' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
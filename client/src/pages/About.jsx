import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldAlert, HeartPulse, BookOpen, Bot, CheckCircle2, 
  ArrowRight, ArrowLeft, Award, HelpCircle, Users, Globe, Sun, Moon 
} from 'lucide-react';

export default function About() {
  const { t, i18n } = useTranslation();
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
    <div className="min-h-screen bg-[#FCFAFF] dark:bg-[#17121D] text-[#1F142E] dark:text-[#F8F4FC] font-sans transition-colors duration-300">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#FCFAFF]/90 dark:bg-[#17121D]/90 backdrop-blur-md border-b border-[#EDE6F5] dark:border-[#2B2037] px-6 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#49305D] flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-6 h-6 text-[#E9B9C8]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-[#49305D] dark:text-white tracking-wide">EduFanor</span>
            <span className="text-[10px] text-[#8A6BBE] font-bold">Learn • Practice • Save Lives</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-xs font-extrabold text-[#6B5E7C] dark:text-[#C9BED5]">
          <Link to="/" className="hover:text-[#49305D] dark:hover:text-white transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
          <Link to="/courses" className="hover:text-[#49305D] dark:hover:text-white transition-colors">{isAr ? 'المساقات' : 'Courses'}</Link>
          <a href="#about" className="text-[#49305D] dark:text-white border-b-2 border-[#8A6BBE] pb-1">{isAr ? 'عن المنصة' : 'About'}</a>
          <Link to="/login" className="hover:text-[#49305D] dark:hover:text-white transition-colors">{isAr ? 'تسجيل الدخول' : 'Login'}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F4EFFB] dark:bg-[#21192B] text-xs font-extrabold text-[#49305D] dark:text-[#F8F4FC] cursor-pointer">
            <Globe className="w-4 h-4 text-[#8A6BBE]" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          <button onClick={toggleTheme} className="p-2.5 rounded-full bg-[#F4EFFB] dark:bg-[#21192B] text-[#49305D] dark:text-[#F8F4FC] cursor-pointer">
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#8A6BBE]" />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E0F5] dark:bg-[#2B2037] border border-[#8A6BBE]/30 text-xs font-bold text-[#49305D] dark:text-[#E9E0F5]">
          <ShieldAlert className="w-4 h-4 text-[#8A6BBE]" />
          <span>{isAr ? 'مشروع التخرج الأكاديمي • إنساني وتوعوي' : 'Academic Graduation Project • Awareness & Humanity'}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#49305D] dark:text-white tracking-tight leading-tight">
          {isAr ? '“قليل من المعرفة يمكن أن يصنع فارقاً كبيراً.”' : '“A Little Knowledge Can Make a Difference.”'}
        </h1>

        <p className="text-lg font-bold text-[#8A6BBE]">
          {isAr ? 'تعلم اليوم. كن مستعداً للمساعدة غداً.' : 'Learn Today. Be Ready to Help Tomorrow.'}
        </p>

        <p className="max-w-3xl mx-auto text-sm lg:text-base text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
          {isAr 
            ? 'الطوارئ يمكن أن تحدث في أي مكان، وقد تستغرق المساعدة وقتاً للوصول. تهدف منصة EduFanor إلى جعل المعرفة الأساسية للإسعافات الأولية أكثر سهولة، مما يساعد الأفراد على تعلم كيفية الاستجابة بهدوء، وأمان، وبشكل مناسب ريثما تصل فرق الإغاثة المتخصصة كالسيارة الإسعاف أو الشرطة.'
            : 'Emergencies can happen anywhere, and help may take time to arrive. EduFanor aims to make first-aid knowledge more accessible, helping people learn how to respond calmly, safely, and appropriately while waiting for professional emergency services.'}
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/courses" className="px-8 py-4 rounded-full bg-[#49305D] hover:bg-[#39244A] text-white font-extrabold text-xs shadow-xl flex items-center gap-3 transition-all">
            <span>{isAr ? 'استكشف المساقات' : 'Explore Our Courses'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
          <Link to="/register" className="px-8 py-4 rounded-full border border-[#8A6BBE] text-[#49305D] dark:text-white font-extrabold text-xs hover:bg-[#8A6BBE]/15 transition-all">
            <span>{isAr ? 'ابدأ التعلم الآن' : 'Start Learning'}</span>
          </Link>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-[#F4EFFB] dark:bg-[#21192B] py-16 px-6 lg:px-16 border-t border-b border-[#EDE6F5] dark:border-[#2B2037]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl lg:text-3xl font-black text-[#49305D] dark:text-white">
              {isAr ? 'قصتنا — لماذا تأسست EduFanor؟' : 'Our Story — Why EduFanor Exists'}
            </h2>
            <p className="text-sm lg:text-base text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
              {isAr 
                ? 'تأسست منصة EduFanor حول فكرة بسيطة ولكنها بالغة الأهمية: يجب أن تكون معرفة الإسعافات الأولية الأساسية أسهل في الوصول والفهم.'
                : 'EduFanor was created around a simple but important idea: basic first-aid knowledge should be easier to access and understand.'}
            </p>
            <p className="text-sm lg:text-base text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
              {isAr 
                ? 'في حالات الطوارئ، تكون الإجراءات المتخذة في اللحظات الأولى حاسمة. ومع ذلك، قد يشعر الكثير من الناس بالتردد أو عدم معرفة من أاين يبدؤون. تهدف EduFanor إلى سد هذه الفجوة التعليمية عبر دروس منظمة واختبارات تفاعلية.'
                : 'In an emergency, the actions taken in the first moments can matter. However, many people may feel unsure about what to do or may not know where to begin. EduFanor aims to help bridge this knowledge gap.'}
            </p>
          </div>
          <div className="lg:col-span-6 bg-white dark:bg-[#2B2037] p-8 rounded-3xl border border-[#EDE6F5] dark:border-[#493B58] shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A6BBE]/20 text-[#8A6BBE] flex items-center justify-center font-black">★</div>
              <h3 className="font-extrabold text-base text-[#49305D] dark:text-white">
                {isAr ? 'هدفنا الإنساني' : 'Our Humanitarian Goal'}
              </h3>
            </div>
            <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
              {isAr 
                ? 'هدفنا ليس تحويل كل فرد إلى خبير طبي، بل تمكين المواطنين العاديين من إدراك أهمية الإسعافات الأولية والتعامل بمسؤولية.'
                : 'Our goal is not to turn everyone into a medical professional, but to empower ordinary people to understand importance of first aid and respond responsibly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#493B58] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#49305D]/10 text-[#49305D] dark:text-[#E9E0F5] flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-[#8A6BBE]" />
          </div>
          <h3 className="text-xl font-black text-[#49305D] dark:text-white">
            {isAr ? 'مهمتنا (Our Mission)' : 'Our Mission'}
          </h3>
          <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
            {isAr 
              ? 'رفع الوعي بالإسعافات الأولية وجعل المعرفة الأساسية أكثر سهولة، لمساعدة الأشخاص على تعلم كيفية تقديم المساعدة الأولية الآمنة والمناسبة ريثما تصل الفرق المتخصصة.'
              : 'To raise awareness about first aid and make essential first-aid knowledge more accessible, helping people learn how to offer safe, appropriate initial assistance while waiting for professionals.'}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#493B58] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#49305D]/10 text-[#49305D] dark:text-[#E9E0F5] flex items-center justify-center">
            <Award className="w-6 h-6 text-[#8A6BBE]" />
          </div>
          <h3 className="text-xl font-black text-[#49305D] dark:text-white">
            {isAr ? 'رؤيتنا (Our Vision)' : 'Our Vision'}
          </h3>
          <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
            {isAr 
              ? 'المساهمة في بناء مجتمع أكثر وعياً واستعداداً، يفهم أفرادُه أهمية الإسعافات الأولية ويعرفون متى وكيف يطلبون المساعدة باحترافية.'
              : 'To contribute to a more informed and prepared community in which more people understand the importance of first aid, know when to seek professional help, and feel better equipped.'}
          </p>
        </div>
      </section>

      {/* Why First-Aid Awareness Matters */}
      <section className="bg-[#F4EFFB] dark:bg-[#21192B] py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl lg:text-3xl font-black text-[#49305D] dark:text-white">
              {isAr ? 'لماذا يعد الوعي بالإسعافات الأولية مهمأ؟' : 'Why First-Aid Awareness Matters'}
            </h2>
            <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5]">
              {isAr ? 'الركائز الأساسية التي نبني عليها محتوانا التعليمي' : 'The core pillars of our educational content'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-[#2B2037] rounded-3xl border border-[#EDE6F5] dark:border-[#493B58] space-y-3 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-[#8A6BBE]" />
              <h4 className="font-extrabold text-sm text-[#49305D] dark:text-white">{isAr ? 'كن أكثر استعداداً' : 'Be More Prepared'}</h4>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5]">{isAr ? 'فهم مبادئ الاستجابة للطوارئ وتعلم كيفية التعامل مع المواقف بأمان.' : 'Understand basic emergency-response principles and approach safely.'}</p>
            </div>
            <div className="p-6 bg-white dark:bg-[#2B2037] rounded-3xl border border-[#EDE6F5] dark:border-[#493B58] space-y-3 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-[#8A6BBE]" />
              <h4 className="font-extrabold text-sm text-[#49305D] dark:text-white">{isAr ? 'معرفة طلب المساعدة' : 'Know How to Seek Help'}</h4>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5]">{isAr ? 'أهمية التواصل مع الخدمات المختصة وتوصيل معلومات دقيقة.' : 'Understand the importance of contacting emergency services.'}</p>
            </div>
            <div className="p-6 bg-white dark:bg-[#2B2037] rounded-3xl border border-[#EDE6F5] dark:border-[#493B58] space-y-3 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-[#8A6BBE]" />
              <h4 className="font-extrabold text-sm text-[#49305D] dark:text-white">{isAr ? 'دعم الآخرين بمسؤولية' : 'Support Others Responsibly'}</h4>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5]">{isAr ? 'مفاهيم إسعافية أولية تسهم في مساعدة المحتاجين بانتظار الإسعاف.' : 'Learn appropriate concepts to help while assistance is on the way.'}</p>
            </div>
            <div className="p-6 bg-white dark:bg-[#2B2037] rounded-3xl border border-[#EDE6F5] dark:border-[#493B58] space-y-3 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-[#8A6BBE]" />
              <h4 className="font-extrabold text-sm text-[#49305D] dark:text-white">{isAr ? 'بناء الثقة بالتعلم' : 'Build Confidence'}</h4>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5]">{isAr ? 'دروس واختبارات منظمة لتعزيز الفهم وتطوير المهارات الشخصية.' : 'Use structured lessons and quizzes to strengthen understanding.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Education Notice */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-8 rounded-3xl bg-[#49305D] text-white shadow-xl space-y-4 text-center">
          <h3 className="text-lg font-black text-[#E9B9C8]">
            {isAr ? 'تعلم المساعدة واحترام الحدود (Learn to Help. Know Your Limits.)' : 'Learn to Help. Know Your Limits.'}
          </h3>
          <p className="text-xs lg:text-sm text-[#E9E0F5] leading-relaxed">
            {isAr 
              ? 'منصة EduFanor هي بيئة تعليمية تهدف لتعزيز الوعي بالإسعافات الأولية وليست بديلاً عن التدريب الميداني المعتمد أو الكوادر الطبية المتخصصة. في حالات الطوارئ، الأولوية دائماً لسلامة المكان والاتصال بخدمات الطوارئ المحلية.'
              : 'EduFanor is an educational platform designed to improve first-aid awareness. Its content does not replace certified practical training or medical professionals. In an emergency, prioritize safety and contact emergency services.'}
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-[#49305D] text-white py-12 px-6 text-center space-y-4 border-t border-[#8A6BBE]/30">
        <h3 className="text-xl font-black">{isAr ? 'تعلمك يمكن أن يحدث فارقاً' : 'Your Learning Could Make a Difference'}</h3>
        <p className="text-xs text-[#E9E0F5]">{isAr ? 'خذ الخطوة الأولى نحو وعي أفضل بالإسعافات الأولية.' : 'Take the first step toward better first-aid awareness.'}</p>
        <div className="flex justify-center gap-4 pt-2">
          <Link to="/courses" className="px-6 py-3 rounded-full bg-white text-[#49305D] font-extrabold text-xs hover:bg-[#E9E0F5] transition-all">
            {isAr ? 'استكشف المساقات' : 'Explore Courses'}
          </Link>
          <Link to="/register" className="px-6 py-3 rounded-full bg-[#8A6BBE] text-white font-extrabold text-xs hover:bg-[#785AAB] transition-all">
            {isAr ? 'انشئ حسابك' : 'Create Account'}
          </Link>
        </div>
        <p className="text-[10px] text-[#C4B8CC] pt-6">© {new Date().getFullYear()} EduFanor Platform. All rights reserved.</p>
      </footer>

    </div>
  );
  
}
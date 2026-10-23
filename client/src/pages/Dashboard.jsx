import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { 
  Flame, 
  Star, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Bot,
  PlayCircle,
  Compass
} from 'lucide-react';

export default function Dashboard() {
  const { i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';

  // قراءة اسم المستخدم حصرياً من الـ Context أو من الـ edu_user الجديد بدون الـ fallback القديم
  const userName = user?.name || (isAr ? 'مستخدم' : 'User');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8F4FC] dark:bg-[#211526] text-[#2C1B33] dark:text-[#F8F4FC] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
        
        {/* Banner Section Original Matching Image */}
        <div className="relative rounded-3xl bg-[#F3EBFA] dark:bg-[#2B1832] p-6 lg:p-8 border border-[#EBE1F5] dark:border-[#493B58] flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden">
          
          {/* Left Text & Action */}
          <div className="space-y-4 z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#35213D] border border-[#E5D8F0] dark:border-[#493B58] text-[11px] font-bold text-[#49305D] dark:text-[#E9E0F5]">
              <Compass className="w-3.5 h-3.5 text-[#8A6BBE]" />
              <span>{isAr ? 'رحلة تعلمك' : 'Your Learning Journey'}</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-[#2D1833] dark:text-white tracking-tight flex items-center gap-2">
              <span>👋</span>
              <span>{isAr ? `مرحباً بعودتك، ${userName}!` : `Welcome back, ${userName}!`}</span>
            </h1>

            <p className="text-xs lg:text-sm text-[#6C567A] dark:text-[#C4B8CC] leading-relaxed font-semibold">
              {isAr 
                ? 'واصل رحلة تعلمك وابنِ الثقة اللازمة للاستجابة لحالات الطوارئ.' 
                : 'Continue your learning journey and build the confidence to respond to emergencies.'}
            </p>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#49305D] hover:bg-[#39244A] text-white font-bold text-xs transition-all shadow-md"
            >
              <span>{isAr ? 'متابعة التعلم' : 'Continue Learning'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>

          {/* Center Graphic Illustration */}
          <div className="relative z-10 w-full md:w-80 h-36 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80" 
              alt="First Aid Kit" 
              className="h-full object-cover rounded-2xl shadow-sm border border-[#E5D8F0] dark:border-[#493B58]"
            />
          </div>

          {/* Right Quote */}
          <div className="hidden lg:flex flex-col items-end justify-center text-end max-w-xs space-y-2 z-10">
            <p className="text-sm font-semibold italic text-[#593E6B] dark:text-[#E9E0F5]">
              {isAr ? '"الأفعال الصغيرة يمكن أن تحدث فارقاً كبيراً."' : '"Small actions can make a big difference."'}
            </p>
            <span className="text-pink-500 font-bold text-lg">♥</span>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-[#35213D] p-5 rounded-3xl border border-[#ECE1F2] dark:border-[#493B58] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#796882] dark:text-[#C4B8CC]">
                {isAr ? 'أيام التعلم المتتالية' : 'Learning Streak'}
              </span>
              <p className="text-2xl font-black text-[#49305D] dark:text-white">3</p>
              <p className="text-[11px] font-bold text-[#8A6BBE]">
                {isAr ? 'أيام متتالية!' : 'Days in a row!'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F6F0FA] dark:bg-[#493B58] text-[#8A6BBE] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#35213D] p-5 rounded-3xl border border-[#ECE1F2] dark:border-[#493B58] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#796882] dark:text-[#C4B8CC]">
                {isAr ? 'معدل الاختبارات' : 'Quiz Average'}
              </span>
              <p className="text-2xl font-black text-[#49305D] dark:text-white">85%</p>
              <p className="text-[11px] font-bold text-emerald-500">
                {isAr ? 'عمل ممتاز!' : 'Great job!'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F6F0FA] dark:bg-[#493B58] text-pink-500 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#35213D] p-5 rounded-3xl border border-[#ECE1F2] dark:border-[#493B58] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#796882] dark:text-[#C4B8CC]">
                {isAr ? 'تقدم التعلم' : 'Learning Progress'}
              </span>
              <p className="text-2xl font-black text-[#49305D] dark:text-white">40%</p>
              <p className="text-[11px] font-bold text-[#8A6BBE]">
                {isAr ? 'أنت في المسار الصحيح!' : "You're on track!"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F6F0FA] dark:bg-[#493B58] text-[#8A6BBE] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#35213D] p-5 rounded-3xl border border-[#ECE1F2] dark:border-[#493B58] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#796882] dark:text-[#C4B8CC]">
                {isAr ? 'الدروس المكتملة' : 'Completed Lessons'}
              </span>
              <p className="text-2xl font-black text-[#49305D] dark:text-white">6</p>
              <p className="text-[11px] font-bold text-[#8A6BBE]">
                {isAr ? 'واصل التقدم!' : 'Keep going!'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F6F0FA] dark:bg-[#493B58] text-[#8A6BBE] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#35213D] rounded-3xl border border-[#ECE1F2] dark:border-[#493B58] p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-extrabold text-base text-[#49305D] dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#8A6BBE]" />
                  <span>{isAr ? 'متابعة التعلم' : 'Continue Learning'}</span>
                </h2>
                <Link to="/courses" className="text-xs font-bold text-[#8A6BBE] hover:underline">
                  {isAr ? 'عرض كل المساقات ←' : 'View All Courses →'}
                </Link>
              </div>

              <div className="bg-[#F8F4FC] dark:bg-[#211526] rounded-2xl p-5 border border-[#ECE1F2] dark:border-[#493B58] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-slate-200 relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80"
                    alt="Course"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#49305D] text-white text-[10px] font-bold">
                    {isAr ? 'قيد التقدم' : 'In Progress'}
                  </span>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <h3 className="font-extrabold text-sm text-[#49305D] dark:text-white">
                    {isAr ? 'أساسيات الاستجابة للطوارئ والإسعاف' : 'Basic Emergency Response'}
                  </h3>
                  <p className="text-xs text-[#796882] dark:text-[#C4B8CC] line-clamp-2">
                    {isAr ? 'تعلم الخطوات الأساسية للتعامل مع حالات التوقف القلبي والحروق والجروح بشكل احترافي.' : 'Learn essential steps to respond effectively to emergency situations.'}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-[#796882] dark:text-[#C4B8CC]">
                      <span>{isAr ? 'التقدم' : 'Progress'}</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full h-2 bg-[#ECE1F2] dark:bg-[#493B58] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8A6BBE] w-[40%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#796882] dark:text-[#C4B8CC] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isAr ? '8 دروس (~2س 30د)' : '8 lessons (~2h 30m)'}</span>
                    </span>

                    <Link
                      to="/courses"
                      className="px-4 py-2 rounded-full bg-[#49305D] text-white text-xs font-bold hover:bg-[#39244A] transition-all flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isAr ? 'متابعة الدرس' : 'Continue Lesson'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#35213D] rounded-3xl border border-[#ECE1F2] dark:border-[#493B58] p-6 shadow-sm space-y-4">
              <h2 className="font-extrabold text-sm text-[#49305D] dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8A6BBE]" />
                <span>{isAr ? 'النشاط الأخير' : 'Recent Activity'}</span>
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8F4FC] dark:bg-[#211526]">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#49305D] dark:text-white">
                      {isAr ? 'درس مكتمل' : 'Completed lesson'}
                    </p>
                    <p className="text-[11px] text-[#796882] dark:text-[#C4B8CC]">
                      {isAr ? 'أساسيات العناية بالجروح' : 'Wound Care Basics'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8F4FC] dark:bg-[#211526]">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#8A6BBE] flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#49305D] dark:text-white">
                      {isAr ? 'اختبار إنهائي' : 'Finished quiz'}
                    </p>
                    <p className="text-[11px] text-[#796882] dark:text-[#C4B8CC]">
                      {isAr ? 'اختبار الاستجابة للطوارئ' : 'Emergency Response Quiz'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#49305D] to-[#35213D] text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-pink-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">
                    {isAr ? 'المساعد الطبي الذكي' : 'Meet Your AI Tutor'}
                  </h3>
                  <p className="text-[11px] text-[#E9E0F5]">
                    {isAr ? 'مساعدك الشخصي للإسعافات الأولية' : 'Interactive First Aid Assistant'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#E9E0F5] leading-relaxed">
                {isAr ? 'هل لديك سؤال طارئ أو ترغب في مراجعة الإجراءات الطبية؟ المساعد الذكي جاهز لإجابتك.' : 'Have an emergency question or want to review medical procedures? AI Tutor is ready.'}
              </p>

              <Link
                to="/ai-tutor"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-white text-[#49305D] font-bold text-xs hover:bg-[#E9E0F5] transition-all"
              >
                <span>{isAr ? 'بدء المحادثة الآن' : 'Start Chatting'}</span>
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
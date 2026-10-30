import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  HeartPulse,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Globe,
  Sun,
  Moon,
  ShieldAlert,
  Compass,
  Users,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CURRENT_YEAR = new Date().getFullYear();

export default function About() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isAr = i18n.language === 'ar';

  const pillars = [
    {
      icon: BookOpen,
      title: isAr ? 'تعلّم منظم' : 'Structured learning',
      text: isAr
        ? 'دروس مقسمة إلى خطوات قصيرة وواضحة تسهل المتابعة والمراجعة.'
        : 'Lessons broken into short, clear steps that are easy to follow and revisit.',
    },
    {
      icon: CheckCircle2,
      title: isAr ? 'تدرّب على الفهم' : 'Practice understanding',
      text: isAr
        ? 'اختبارات قصيرة وتغذية راجعة فورية تساعد على تثبيت المعرفة.'
        : 'Short quizzes and instant feedback help knowledge stick.',
    },
    {
      icon: ShieldAlert,
      title: isAr ? 'حدود واضحة' : 'Clear boundaries',
      text: isAr
        ? 'محتوى تعليمي لا يغني عن التدريب المعتمد أو خدمات الطوارئ.'
        : 'Educational content that never replaces certified training or emergency services.',
    },
    {
      icon: Compass,
      title: isAr ? 'تعلّم بلغتك' : 'Learn in your language',
      text: isAr
        ? 'واجهة عربية أصلية واتجاه صحيح، مع إنجليزية طبيعية وتبديل فوري.'
        : 'A native Arabic interface with correct direction, natural English, and instant switching.',
    },
  ];

  const values = [
    {
      icon: HeartPulse,
      title: isAr ? 'رسالتنا' : 'Our mission',
      text: isAr
        ? 'جعل المعرفة الأساسية بالإسعافات الأولية أكثر سهولة، لمساعدة الناس على تقديم مساعدة أولية مناسبة وآمنة إلى حين وصول الفرق المتخصصة.'
        : 'To make essential first-aid knowledge more accessible, helping people offer appropriate and safe initial assistance while professional help is on the way.',
    },
    {
      icon: Award,
      title: isAr ? 'رؤيتنا' : 'Our vision',
      text: isAr
        ? 'مجتمع أكثر وعياً واستعداداً، يفهم فيه المزيد من الناس أهمية الإسعافات الأولية ومتى يجب طلب المساعدة المتخصصة.'
        : 'A more informed and prepared community where more people understand the importance of first aid and when to seek professional help.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldCheck className="h-5 w-5 text-amber-soft" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold leading-none tracking-tight text-ink">
                EduFanor
              </span>
              <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted sm:block">
                {isAr ? 'عن المنصة' : 'About the platform'}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label={isAr ? 'التنقل' : 'Navigation'}>
            <Link
              to="/"
              className="rounded-full px-3.5 py-2 text-xs font-bold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <Link
              to="/#courses"
              className="rounded-full px-3.5 py-2 text-xs font-bold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {isAr ? 'المساقات' : 'Courses'}
            </Link>
            <span className="rounded-full bg-brand-soft px-3.5 py-2 text-xs font-extrabold text-brand-ink">
              {isAr ? 'عن المنصة' : 'About'}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[10px] font-extrabold text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('nav.toggleLanguage')}
            >
              <Globe className="h-3.5 w-3.5 text-brand-ink" />
              {isAr ? 'EN' : 'ع'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('nav.toggleTheme')}
            >
              {isDark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-brand-ink" />}
            </button>
            <Link to="/login" className="hidden px-3 py-2 text-xs font-bold text-ink-muted hover:text-ink sm:inline-flex">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="btn-primary px-4 text-xs">
              {isAr ? 'ابدأ مجاناً' : 'Start free'}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-line bg-beige py-20 dark:bg-[#101A15] md:py-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 90% 8%, rgba(245,158,66,0.16), transparent 46%), radial-gradient(circle at 4% 100%, rgba(120,155,131,0.2), transparent 52%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                <Users className="h-3.5 w-3.5 text-accent" />
                {isAr ? 'مشروع تعليمي توعوي' : 'An educational awareness project'}
              </span>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
                {isAr ? (
                  <>
                    «قليل من المعرفة
                    <br />
                    <span className="italic text-accent">يمكن أن يصنع فارقاً.»</span>
                  </>
                ) : (
                  <>
                    “A little knowledge
                    <br />
                    <span className="italic text-accent">can make a difference.”</span>
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
                {isAr
                  ? 'قد تحدث الطوارئ في أي مكان، وقد يستغرق وصول المساعدة وقتاً. تهدف EduFanor إلى جعل المعرفة الأساسية بالإسعافات الأولية أكثر سهولة، لمساعدة الأفراد على التعلم والاستجابة بهدوء ومسؤولية إلى حين وصول فرق الإنقاذ المختصة.'
                  : 'Emergencies can happen anywhere, and help may take time to arrive. EduFanor aims to make essential first-aid knowledge more accessible, helping people learn to respond calmly and responsibly while professional help is on the way.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary px-6">
                  {isAr ? 'ابدأ التعلّم' : 'Start learning'}
                  {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
                <Link to="/#courses" className="btn-secondary px-6">
                  {isAr ? 'استعرض المساقات' : 'Browse courses'}
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-3xl border border-line bg-card p-7 shadow-pop">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                  {isAr ? 'لماذا وُجدت EduFanor' : 'Why EduFanor exists'}
                </p>
                <p className="mt-4 font-display text-2xl font-semibold leading-snug text-ink">
                  {isAr
                    ? 'لأن المعرفة الأساسية يجب أن تكون أسهل في الوصول والفهم.'
                    : 'Because essential knowledge should be easier to access and understand.'}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {isAr
                    ? 'في اللحظات الأولى، قد يشعر كثيرون بالتردد أو لا يعرفون من أين يبدأون. تسعى المنصة إلى سد هذه الفجوة التعليمية عبر دروس منظمة واختبارات قصيرة.'
                    : 'In the first moments, many people may feel unsure or not know where to begin. The platform aims to help bridge that learning gap through structured lessons and short quizzes.'}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-bold leading-relaxed text-ink-muted">
                    {isAr ? 'تعلّم لتساعد. واعرف حدودك.' : 'Learn to help. Know your limits.'}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-surface py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-2 lg:px-12">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="card p-7">
                  <span className="icon-box h-11 w-11 bg-brand-soft text-brand-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-extrabold text-ink">{value.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{value.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-line bg-beige py-20 dark:bg-[#101A15] md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="max-w-2xl">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                {isAr ? 'ركائز المحتوى' : 'Content pillars'}
              </span>
              <h2 className="mt-3 section-title">
                {isAr ? 'لماذا الوعي بالإسعافات الأولية مهم؟' : 'Why first-aid awareness matters'}
              </h2>
              <p className="section-subtitle">
                {isAr
                  ? 'أربع ركائز نبني عليها تجربة التعلّم، دون ادعاءات طبية أو وعود لا يمكن التحقق منها.'
                  : 'Four pillars shape the learning experience, without medical claims or unverifiable promises.'}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.title} className="rounded-2xl border border-line bg-surface p-5">
                    <span className="icon-box h-10 w-10 bg-surface-muted text-brand-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-sm font-extrabold text-ink">{pillar.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{pillar.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-surface py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
            <span className="icon-box mx-auto h-12 w-12 bg-amber/15 text-accent">
              <ShieldAlert className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {isAr ? 'تعلّم لتساعد. واعرف حدودك.' : 'Learn to help. Know your limits.'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {isAr
                ? 'EduFanor بيئة تعليمية لتعزيز الوعي بالإسعافات الأولية، وليست بديلاً عن التدريب الميداني المعتمد أو الكادر الطبي المتخصص. في أي طارئ، الأولوية لسلامة المكان والاتصال بخدمات الطوارئ المحلية.'
                : 'EduFanor is an educational environment for first-aid awareness. It does not replace certified practical training or medical professionals. In any emergency, prioritize scene safety and contact local emergency services.'}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary px-6">
                {isAr ? 'ابدأ التعلّم الآن' : 'Start learning now'}
              </Link>
              <Link to="/" className="btn-secondary px-6">
                {isAr ? 'العودة للرئيسية' : 'Back to home'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-[11px] text-ink-muted sm:flex-row sm:text-start lg:px-12">
          <p>
            © {CURRENT_YEAR} EduFanor. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}

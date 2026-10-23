import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  BookCheck,
  TrendingUp,
  Award,
  Flame,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Bot,
  Zap,
  X,
  HeartPulse,
  Flame as BurnIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Wind,
  Target,
} from 'lucide-react';

const categoryIcons = {
  cpr: HeartPulse,
  choking: Wind,
  burns: Flame,
};

const categoryColors = {
  cpr: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
  choking: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  burns: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const avatarUrl = localStorage.getItem('user_avatar') || 'https://api.dicebear.com/7.x/bottts/svg?seed=Noura1';
  const allCourses = t('coursesData', { returnObjects: true }) || [];

  const cprDone = localStorage.getItem('completed_cpr') === 'true' ? 1 : 0;
  const chokingDone = localStorage.getItem('completed_choking') === 'true' ? 1 : 0;
  const burnsDone = localStorage.getItem('completed_burns') === 'true' ? 1 : 0;
  const totalCompleted = cprDone + chokingDone + burnsDone;
  const progressPercent = Math.round((totalCompleted / 3) * 100);

  const filteredCourses = allCourses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    {
      icon: BookCheck,
      label: t('dashboard.stats.completedLessons'),
      value: `${totalCompleted} / ${allCourses.length}`,
      color: 'bg-brand-soft text-brand-ink',
    },
    {
      icon: TrendingUp,
      label: t('dashboard.stats.learningProgress'),
      value: `${progressPercent}%`,
      color: 'bg-teal/20 text-teal-deep',
    },
    {
      icon: Award,
      label: t('dashboard.stats.quizAverage'),
      value: progressPercent > 0 ? '100%' : '—',
      color: 'bg-brand-soft text-brand-ink',
    },
    {
      icon: Flame,
      label: t('dashboard.stats.learningStreak'),
      value: `1 ${t('dashboard.stats.days')}`,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
    },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="border-b border-line bg-surface">
        <div className="page-content py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-5 max-w-2xl text-center lg:text-start">
              <span className="chip bg-brand-soft text-brand-ink">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{t('dashboard.badge')}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-tight text-balance">
                {t('dashboard.welcomeBack')}{' '}
                <span className="text-primary">{user?.name || t('dashboard.studentName')}</span>
              </h1>

              <p className="text-ink-muted text-base leading-relaxed max-w-xl">
                {t('dashboard.welcomeSubtitle')}
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
                <Link to="/courses" className="btn-primary px-6 py-3 text-sm">
                  <span>{t('dashboard.continueBtn')}</span>
                  {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
                <button
                  onClick={() => setGuideModalOpen(true)}
                  className="btn-secondary px-5 py-3 text-sm"
                >
                  <Zap className="h-4 w-4 text-brand-ink" />
                  <span>{t('quickGuide.btnText')}</span>
                </button>
              </div>
            </div>

            <Link
              to="/ai-tutor"
              className="card w-full lg:w-80 p-6 flex flex-col gap-4 transition-all hover:shadow-lift hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div className="icon-box h-12 w-12 bg-primary text-white">
                  <Bot className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <h4 className="font-extrabold text-ink text-sm">EduFanor AI</h4>
                  <p className="text-xs text-ink-muted">Emergency First Aid Tutor</p>
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                {isAr
                  ? 'متاح 24/7 للإجابة عن التساؤلات الطبية وتوضيح خطوات الإسعافات الأولية.'
                  : 'Available 24/7 to answer medical questions and explain first aid steps.'}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
                <span>{t('dashboard.aiSection.askBtn')}</span>
                {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="page-content space-y-10">
        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="stat-card">
                <div className={`icon-box h-10 w-10 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-[11px] font-bold text-ink-muted">{stat.label}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-ink">{stat.value}</h3>
              </div>
            );
          })}
        </section>

        {/* Student Academic ID Badge */}
        <section className="card p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="h-18 w-18 rounded-2xl bg-surface-muted p-1.5 border-2 border-primary shrink-0">
            <img src={avatarUrl} alt="Student Avatar" className="h-full w-full object-cover rounded-xl" />
          </div>
          <div className="space-y-1 text-center sm:text-start flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-extrabold text-base text-ink">
                {user?.name || t('dashboard.studentName')}
              </h3>
              <span className="chip bg-success-soft text-success-ink">
                {t('studentCard.active')}
              </span>
            </div>
            <p className="text-xs text-ink-muted">{t('studentCard.subtitle')}</p>
            <p className="text-[11px] font-mono font-bold text-primary">
              {t('studentCard.idLabel')} EDU-2026-8942
            </p>
          </div>
          <Link to="/profile" className="btn-secondary px-4 py-2 text-xs shrink-0">
            {t('nav.profile')}
          </Link>
        </section>

        {/* Daily Challenge */}
        <section className="card p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="icon-box h-10 w-10 bg-primary text-white shrink-0">
              <Target className="h-5 w-5 text-teal" />
            </div>
            <div className="space-y-1">
              <span className="chip bg-brand-soft text-brand-ink">
                {t('challenge.title')}
              </span>
              <h2 className="text-lg font-extrabold text-ink">
                {t('challenge.question')}
              </h2>
            </div>
          </div>

          <div className="space-y-2.5">
            {[1, 2, 3].map((num) => {
              const isSelected = selectedOption === num;
              const isCorrect = num === 1;
              const isWrong = num !== 1;
              return (
                <button
                  key={num}
                  onClick={() => setSelectedOption(num)}
                  className={`w-full p-4 rounded-xl text-xs font-bold text-start transition-all border ${
                    isSelected && isCorrect
                      ? 'bg-success-soft border-emerald-500 text-emerald-900 dark:text-emerald-100'
                      : isSelected && isWrong
                      ? 'bg-red-50 border-red-400 text-red-900 dark:bg-red-950/30 dark:text-red-100'
                      : 'bg-surface-muted border-line hover:border-primary/40'
                  }`}
                >
                  {num}. {t(`challenge.opt${num}`)}
                </button>
              );
            })}
          </div>

          {selectedOption === 1 && (
            <div className="p-4 rounded-xl bg-success-soft text-success-ink text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{t('challenge.correctMsg')}</span>
            </div>
          )}

          {(selectedOption === 2 || selectedOption === 3) && (
            <div className="p-4 rounded-xl bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <XCircle className="h-5 w-5 shrink-0" />
              <span>{t('challenge.wrongMsg')}</span>
            </div>
          )}
        </section>

        {/* Course Search & Filter */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="section-title">{t('dashboard.exploreSection.title')}</h2>
              <p className="section-subtitle">{t('dashboard.exploreSection.subtitle')}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'cpr', 'choking', 'burns'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'card text-ink-muted hover:text-ink'
                  }`}
                >
                  {t(`filter.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className={`h-4 w-4 absolute top-1/2 -translate-y-1/2 text-ink-muted ${isAr ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('filter.searchPlaceholder')}
              className={`input ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {filteredCourses.map((course) => {
                const isCourseCompleted = localStorage.getItem(`completed_${course.id}`) === 'true';
                const CategoryIcon = categoryIcons[course.category] || HeartPulse;
                const colorClass = categoryColors[course.category] || 'bg-brand-soft text-brand-ink';

                return (
                  <div key={course.id} className="course-card">
                    <div className="flex items-start justify-between">
                      <div className={`icon-box h-11 w-11 ${colorClass}`}>
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="chip bg-brand-soft text-brand-ink">{course.level}</span>
                        {isCourseCompleted && (
                          <span className="chip bg-success-soft text-success-ink">
                            <CheckCircle2 className="h-3 w-3" />
                            {t('coursesPage.completed')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-ink">{course.title}</h3>
                      <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-line flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-muted">
                        {course.lessons} {t('coursesPage.lessonsCount')}
                      </span>
                      <Link
                        to={`/lesson?id=${course.id}`}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          isCourseCompleted
                            ? 'bg-success-soft text-success-ink'
                            : 'bg-primary text-white hover:bg-primary-hover'
                        }`}
                      >
                        <span>
                          {isCourseCompleted
                            ? t('coursesPage.continueCourse')
                            : t('dashboard.exploreSection.viewCourse')}
                        </span>
                        {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state card">
              <div className="icon-box h-14 w-14 bg-surface-muted text-ink-muted">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-base font-extrabold text-ink">
                {t('dashboard.exploreSection.emptyTitle')}
              </h3>
              <p className="text-xs text-ink-muted max-w-xs">
                {t('dashboard.exploreSection.emptyDesc')}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="btn-secondary px-4 py-2 text-xs mt-2"
              >
                {t('dashboard.exploreSection.resetBtn')}
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Emergency Pocket Guide Modal */}
      {guideModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setGuideModalOpen(false)}>
          <div
            className="card w-full max-w-lg p-6 space-y-5 animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-extrabold text-lg text-ink">{t('quickGuide.title')}</h3>
              </div>
              <button
                onClick={() => setGuideModalOpen(false)}
                className="p-2 rounded-lg bg-surface-muted hover:bg-line text-ink-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { icon: HeartPulse, title: t('quickGuide.chokingTitle'), desc: t('quickGuide.chokingDesc') },
                { icon: HeartPulse, title: t('quickGuide.cprTitle'), desc: t('quickGuide.cprDesc') },
                { icon: BurnIcon, title: t('quickGuide.burnsTitle'), desc: t('quickGuide.burnsDesc') },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-surface-muted border border-line space-y-1.5">
                    <h4 className="font-extrabold text-xs text-primary flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-14 border-t border-line bg-surface">
        <div className="page-content py-8 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-start">
            <div>
              <h3 className="text-base font-extrabold text-ink">{t('nav.brand')}</h3>
              <p className="text-xs text-ink-muted mt-1">{t('footer.desc')}</p>
            </div>
            <div className="flex items-center gap-5 text-xs font-bold text-ink-muted">
              <Link to="/courses" className="hover:text-primary transition-colors">{t('footer.courses')}</Link>
              <Link to="/ai-tutor" className="hover:text-primary transition-colors">{t('footer.aiTutor')}</Link>
            </div>
          </div>
          <div className="border-t border-line pt-5 text-center text-xs text-ink-muted">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}

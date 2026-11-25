import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { useTheme } from '../context/ThemeContext';
import { isCourseCompleted } from '../lib/progress';
import ThemeToggle from '../components/ui/ThemeToggle';
import EduFanorWordmark from '../components/EduFanorWordmark';
import { ArrowLeft, ArrowRight, Award, Download, Linkedin, Printer, Share2, ShieldCheck } from '../components/icons';

function buildCertificateId(courseId, studentId, completedAt) {
  const raw = `${courseId}|${studentId}|${completedAt}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  const year = new Date(completedAt).getFullYear();
  return `EDU-${year}-${String(hash % 1000000).padStart(6, '0')}`;
}

function getCompletionDate(courseId) {
  try {
    const stored = localStorage.getItem(`completed_at_${courseId}`) || localStorage.getItem(`completed_${courseId}_at`);
    if (stored) return new Date(stored).toISOString();
  } catch { /* ignore */ }
  return new Date().toISOString();
}

export default function Certificate() {
  const { courseId } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const { courses } = useCatalog();
  const { isDark, toggleTheme } = useTheme();
  const certRef = useRef(null);
  const [toast, setToast] = useState('');
  const isAr = i18n.language === 'ar';

  const course = useMemo(() => (Array.isArray(courses) ? courses.find((c) => c.id === courseId) : null), [courses, courseId]);
  const completed = isCourseCompleted(courseId);
  const completedAt = useMemo(() => getCompletionDate(courseId), [courseId]);
  const studentName = user?.name || (isAr ? 'متعلّم' : 'Learner');
  const studentId = String(user?._id || user?.id || user?.email || studentName);
  const certificateId = useMemo(() => buildCertificateId(courseId || '', studentId, completedAt), [courseId, studentId, completedAt]);
  const completionDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(isAr ? 'ar-MA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(completedAt));
    } catch {
      return new Date(completedAt).toLocaleDateString();
    }
  }, [completedAt, isAr]);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const issueDate = new Date(completedAt);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const title = `${t('certificate.title')} - ${course?.title || 'EduFanor'}`;
    const text = `${studentName} - ${course?.title || ''}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
    } catch { /* fall back to copy */ }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast(t('certificate.linkCopied'));
    } catch {
      setToast(t('certificate.copyFailed'));
    }
  };

  const handleLinkedIn = () => {
    const certUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(course?.title || 'First Aid Course')}&organizationName=${encodeURIComponent('EduFanor')}&issueYear=${issueDate.getFullYear()}&issueMonth=${issueDate.getMonth() + 1}&certUrl=${encodeURIComponent(shareUrl)}&certId=${encodeURIComponent(certificateId)}`;
    window.open(certUrl, '_blank', 'noopener,noreferrer');
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex items-center justify-center p-6">
        <div className="card p-8 text-center max-w-md">
          <p className="text-sm font-bold text-ink-soft">{isAr ? 'المساق غير موجود.' : 'Course not found.'}</p>
          <Link to="/courses" className="btn-primary mt-4 inline-flex px-4 text-xs">{t('certificate.backToCourses')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F1F5] text-[#18122B] dark:bg-[#18122B] dark:text-[#F3F1F5] transition-colors">
      <style>{`
        @media print {
          body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cert-no-print { display: none !important; }
          .cert-shell { padding: 0 !important; background: #fff !important; min-height: auto !important; }
          .cert-card { box-shadow: none !important; margin: 0 auto !important; max-width: 100% !important; border: 8px double #635985 !important; }
        }
        @page { size: landscape; margin: 0.35in; }
      `}</style>

      <header className="cert-no-print sticky top-0 z-30 border-b border-[#BFA2DB]/30 bg-[#F3F1F5]/90 backdrop-blur-xl dark:border-[#635985]/40 dark:bg-[#18122B]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#443C68] transition-colors hover:text-[#18122B] dark:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('certificate.backToCourses')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle checked={isDark} onChange={toggleTheme} className="scale-[0.68] origin-center" ariaLabel="Toggle dark mode" />
          </div>
        </div>
      </header>

      <main className="cert-shell mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {!completed ? (
          <div className="cert-no-print mx-auto max-w-xl rounded-2xl border border-[#BFA2DB]/30 bg-white p-8 text-center shadow-lg dark:border-[#635985]/40 dark:bg-[#393053]">
            <Award className="mx-auto h-12 w-12 text-[#BFA2DB]" />
            <p className="mt-4 text-sm font-semibold text-[#443C68] dark:text-[#BFA2DB]">{t('certificate.notCompleted')}</p>
            <Link to={`/lesson?id=${course.id}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#635985] px-5 py-3 text-sm font-semibold text-white hover:bg-[#443C68] dark:bg-[#BFA2DB] dark:text-[#18122B] dark:hover:bg-[#F0D9FF]">
              {isAr ? 'متابعة المساق' : 'Continue course'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div
              ref={certRef}
              className="cert-card relative mx-auto max-w-[1050px] overflow-hidden rounded-[28px] border-[10px] border-double border-[#635985]/60 bg-[#FFFEFC] px-6 py-8 text-center shadow-[0_30px_80px_-30px_rgba(68,60,104,0.45)] dark:border-[#BFA2DB]/60 dark:bg-[#241C3A] sm:px-10 sm:py-10"
            >
              <div className="pointer-events-none absolute inset-4 rounded-[20px] border border-[#BFA2DB]/40 dark:border-[#635985]/50" aria-hidden="true" />
              <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#F0D9FF]/40 blur-3xl dark:bg-[#635985]/20" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#BFA2DB]/30 blur-3xl dark:bg-[#443C68]/30" aria-hidden="true" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#635985] to-[#443C68] text-[#F0D9FF] shadow-lg">
                    <ShieldCheck className="h-7 w-7" />
                  </span>
                  <div className="text-start">
                    <EduFanorWordmark className="w-32 text-[#443C68] dark:text-[#F0D9FF]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#635985] dark:text-[#BFA2DB]">First Aid Learning</p>
                  </div>
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-[#635985] dark:text-[#BFA2DB]">{t('certificate.organization')}</p>
                <h1 className="mt-3 font-['Viga'] text-4xl leading-tight text-[#443C68] dark:text-[#F0D9FF] sm:text-5xl">{t('certificate.title')}</h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#635985] dark:text-[#BFA2DB]/90">{t('certificate.subtitle')}</p>

                <div className="mx-auto mt-8 h-px w-28 bg-gradient-to-r from-transparent via-[#BFA2DB] to-transparent" />
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[#7F7C82] dark:text-[#BFA2DB]/70">{t('certificate.presentedTo')}</p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#18122B] dark:text-white sm:text-5xl">{studentName}</p>
                <div className="mx-auto mt-4 h-px w-64 max-w-full bg-[#BFA2DB]/50" />

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#7F7C82] dark:text-[#BFA2DB]/70">{t('certificate.forCompleting')}</p>
                <p className="mt-2 text-2xl font-extrabold text-[#443C68] dark:text-[#F0D9FF] sm:text-3xl">{course.title}</p>

                <div className="mt-10 grid gap-4 border-t border-[#BFA2DB]/35 pt-6 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7F7C82] dark:text-[#BFA2DB]/70">{t('certificate.completedOn')}</p>
                    <p className="mt-1 font-semibold text-[#443C68] dark:text-[#F3F1F5]">{completionDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7F7C82] dark:text-[#BFA2DB]/70">{t('certificate.certificateId')}</p>
                    <p className="mt-1 font-mono font-semibold text-[#443C68] dark:text-[#F3F1F5]">{certificateId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7F7C82] dark:text-[#BFA2DB]/70">{t('certificate.signature')}</p>
                    <p className="mt-1 font-semibold text-[#443C68] dark:text-[#F3F1F5]">EduFanor</p>
                  </div>
                </div>

                <p className="mt-6 text-[11px] leading-relaxed text-[#7F7C82] dark:text-[#BFA2DB]/70">{t('certificate.educationalNote')}</p>
              </div>
            </div>

            <div className="cert-no-print mx-auto flex max-w-[1050px] flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full bg-[#635985] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#443C68] dark:bg-[#BFA2DB] dark:text-[#18122B] dark:hover:bg-[#F0D9FF]">
                <Download className="h-4 w-4" />
                {t('certificate.download')}
              </button>
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full border border-[#635985]/35 bg-white px-5 py-3 text-sm font-semibold text-[#443C68] transition hover:-translate-y-0.5 hover:bg-[#F0D9FF]/40 dark:border-[#BFA2DB]/40 dark:bg-[#393053] dark:text-[#F0D9FF]">
                <Printer className="h-4 w-4" />
                {t('certificate.print')}
              </button>
              <button type="button" onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-[#635985]/35 bg-white px-5 py-3 text-sm font-semibold text-[#443C68] transition hover:-translate-y-0.5 hover:bg-[#F0D9FF]/40 dark:border-[#BFA2DB]/40 dark:bg-[#393053] dark:text-[#F0D9FF]">
                <Share2 className="h-4 w-4" />
                {t('certificate.share')}
              </button>
              <button type="button" onClick={handleLinkedIn} className="inline-flex items-center gap-2 rounded-full border border-[#635985]/35 bg-white px-5 py-3 text-sm font-semibold text-[#443C68] transition hover:-translate-y-0.5 hover:bg-[#F0D9FF]/40 dark:border-[#BFA2DB]/40 dark:bg-[#393053] dark:text-[#F0D9FF]">
                <Linkedin className="h-4 w-4" />
                {t('certificate.shareLinkedIn')}
              </button>
            </div>

            {toast && (
              <div className="cert-no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#443C68] px-4 py-2 text-sm font-semibold text-white shadow-lg dark:bg-[#BFA2DB] dark:text-[#18122B]">
                {toast}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

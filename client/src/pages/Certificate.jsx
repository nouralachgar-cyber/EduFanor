import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCatalog } from '../context/CatalogContext';
import CertificateDocument from '../components/certificate/CertificateDocument';
import ThemeToggle from '../components/ui/ThemeToggle';
import { ArrowLeft, Award, Download, Linkedin, Printer, Share2, ShieldCheck } from '../components/icons';
import { downloadCertificatePdf, getCourseCertificate } from '../lib/certificates';
import { certificateFileName } from '../lib/certificateLayout';

export default function Certificate() {
  const { courseId } = useParams();
  const { courses } = useCatalog();
  const { isDark, toggleTheme } = useTheme();
  const svgRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [downloading, setDownloading] = useState(false);

  const fallbackCourse = useMemo(
    () => (Array.isArray(courses) ? courses.find((course) => course.id === courseId) : null),
    [courses, courseId]
  );
  const certificate = status?.certificate || null;
  const courseTitle = status?.course?.title || certificate?.courseTitle || fallbackCourse?.title || 'this course';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError('');
      setStatus(null);
      getCourseCertificate(courseId)
        .then((data) => {
          if (active) setStatus(data);
        })
        .catch((requestError) => {
          if (!active) return;
          if (requestError?.status === 401) {
            setError('Sign in to view this certificate.');
            return;
          }
          setError(requestError?.message || 'Unable to load this certificate.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [courseId]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleDownload = async () => {
    if (!certificate || downloading) return;
    setDownloading(true);
    try {
      await downloadCertificatePdf(svgRef.current, certificateFileName(certificate));
      setToast('Certificate downloaded.');
    } catch {
      setToast('Unable to create the PDF. Please use Print / Save PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const title = `Certificate of Completion - ${courseTitle}`;
    const text = `${certificate?.studentName || 'Learner'} completed ${courseTitle} with EduFanor.`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
    } catch {
      setToast('Sharing was cancelled.');
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast('Certificate link copied.');
    } catch {
      setToast('Unable to copy the certificate link.');
    }
  };

  const handleLinkedIn = () => {
    const completedAt = new Date(certificate?.completedAt);
    const url = new URL('https://www.linkedin.com/profile/add');
    url.searchParams.set('startTask', 'CERTIFICATION_NAME');
    url.searchParams.set('name', courseTitle);
    url.searchParams.set('organizationName', 'EduFanor');
    url.searchParams.set('issueYear', String(completedAt.getUTCFullYear()));
    url.searchParams.set('issueMonth', String(completedAt.getUTCMonth() + 1));
    url.searchParams.set('certUrl', shareUrl);
    url.searchParams.set('certId', certificate?.certificateId || '');
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="certificate-page min-h-screen bg-[#F3F1F5] text-[#18122B] dark:bg-[#18122B] dark:text-[#F3F1F5]">
      <style>{`
        @page { size: A4 landscape; margin: 0; }
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          .cert-no-print { display: none !important; }
          .certificate-page { min-height: 0 !important; padding: 0 !important; background: #fff !important; }
          .certificate-stage { display: block !important; max-width: none !important; padding: 0 !important; }
          .certificate-document {
            width: 297mm !important;
            height: 210mm !important;
            max-width: none !important;
            margin: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .certificate-svg { width: 100% !important; height: 100% !important; display: block !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <header className="cert-no-print sticky top-0 z-30 border-b border-[#BFA2DB]/30 bg-[#F3F1F5]/90 backdrop-blur-xl dark:border-[#635985]/40 dark:bg-[#18122B]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#443C68] transition-colors hover:text-[#18122B] dark:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to courses</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-[#635985] dark:text-[#BFA2DB] sm:inline">
              Certificate
            </span>
            <ThemeToggle checked={isDark} onChange={toggleTheme} className="scale-[0.68] origin-center" ariaLabel="Toggle dark mode" />
          </div>
        </div>
      </header>

      <main className="certificate-stage mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {loading && (
          <div className="mx-auto max-w-xl rounded-2xl border border-[#BFA2DB]/30 bg-white p-10 text-center shadow-lg dark:border-[#635985]/40 dark:bg-[#393053]">
            <ShieldCheck className="mx-auto h-10 w-10 animate-pulse text-[#BFA2DB]" />
            <p className="mt-4 text-sm font-semibold">Checking certificate eligibility…</p>
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-xl rounded-2xl border border-[#BFA2DB]/30 bg-white p-10 text-center shadow-lg dark:border-[#635985]/40 dark:bg-[#393053]">
            <Award className="mx-auto h-10 w-10 text-[#BFA2DB]" />
            <p className="mt-4 text-sm font-semibold">{error}</p>
            <Link to="/courses" className="mt-5 inline-flex rounded-full bg-[#635985] px-5 py-3 text-sm font-semibold text-white">
              Back to courses
            </Link>
          </div>
        )}

        {!loading && !error && !certificate && (
          <div className="mx-auto max-w-xl rounded-2xl border border-[#BFA2DB]/30 bg-white p-8 text-center shadow-lg dark:border-[#635985]/40 dark:bg-[#393053] sm:p-10">
            <Award className="mx-auto h-12 w-12 text-[#BFA2DB]" />
            <h1 className="mt-4 text-xl font-bold">Certificate not available yet</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#635985] dark:text-[#BFA2DB]">
              Complete every published lesson and assessment in <strong>{courseTitle}</strong> to unlock your certificate.
            </p>
            {status?.progress && (
              <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-[#F3F1F5] p-3 dark:bg-[#241C3A]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7F7C82] dark:text-[#BFA2DB]">Lessons</p>
                  <p className="mt-1 text-base font-bold">
                    {status.progress.completedLessonCount} / {status.progress.lessonCount}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F3F1F5] p-3 dark:bg-[#241C3A]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7F7C82] dark:text-[#BFA2DB]">Assessments</p>
                  <p className="mt-1 text-base font-bold">
                    {status.progress.passedAssessmentCount} / {status.progress.assessmentCount}
                  </p>
                </div>
              </div>
            )}
            <Link
              to={`/lesson?id=${courseId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#635985] px-5 py-3 text-sm font-semibold text-white hover:bg-[#443C68]"
            >
              Continue course
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        )}

        {!loading && !error && certificate && (
          <div className="space-y-6">
            {status?.newlyIssued && (
              <div className="cert-no-print mx-auto max-w-[1122px] rounded-xl border border-[#BFA2DB]/40 bg-white px-4 py-3 text-center text-sm font-semibold text-[#443C68] dark:border-[#635985]/40 dark:bg-[#393053] dark:text-[#F0D9FF]">
                Your certificate has been issued.
              </div>
            )}
            <div className="certificate-document mx-auto w-full max-w-[1122px] overflow-hidden rounded-[16px] border border-[#D8C8EE] bg-white shadow-[0_30px_80px_-30px_rgba(68,60,104,0.45)]">
              <CertificateDocument certificate={certificate} svgRef={svgRef} />
            </div>

            <div className="cert-no-print mx-auto flex max-w-[1122px] flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={handleDownload} disabled={downloading} className="inline-flex items-center gap-2 rounded-full bg-[#635985] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#443C68] disabled:cursor-wait disabled:opacity-70 dark:bg-[#BFA2DB] dark:text-[#18122B] dark:hover:bg-[#F0D9FF]">
                <Download className="h-4 w-4" />
                {downloading ? 'Creating PDF…' : 'Download PDF'}
              </button>
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-[#635985]/35 bg-white px-5 py-3 text-sm font-semibold text-[#443C68] transition hover:-translate-y-0.5 hover:bg-[#F0D9FF]/40 dark:border-[#BFA2DB]/40 dark:bg-[#393053] dark:text-[#F0D9FF]">
                <Printer className="h-4 w-4" />
                Print / Save PDF
              </button>
              <button type="button" onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-[#635985]/35 bg-white px-5 py-3 text-sm font-semibold text-[#443C68] transition hover:-translate-y-0.5 hover:bg-[#F0D9FF]/40 dark:border-[#BFA2DB]/40 dark:bg-[#393053] dark:text-[#F0D9FF]">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button type="button" onClick={handleLinkedIn} className="inline-flex items-center gap-2 rounded-full border border-[#635985]/35 bg-white px-5 py-3 text-sm font-semibold text-[#443C68] transition hover:-translate-y-0.5 hover:bg-[#F0D9FF]/40 dark:border-[#BFA2DB]/40 dark:bg-[#393053] dark:text-[#F0D9FF]">
                <Linkedin className="h-4 w-4" />
                Add to LinkedIn
              </button>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div className="cert-no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#443C68] px-4 py-2 text-sm font-semibold text-white shadow-lg dark:bg-[#BFA2DB] dark:text-[#18122B]">
          {toast}
        </div>
      )}
    </div>
  );
}

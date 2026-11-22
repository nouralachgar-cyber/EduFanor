import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, ArrowLeft, Sparkles } from '../icons';
import AchievementActions from './AchievementActions';
import AchievementCelebration from './AchievementCelebration';
import AchievementGraphic from './AchievementGraphic';

export default function AchievementPanel({
  achievement,
  progress,
  studentName,
  newlyCreated = false,
  celebrateOnLoad = false,
  loading = false,
  error = false,
}) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const svgRef = useRef(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [dismissedAchievementId, setDismissedAchievementId] = useState('');
  const celebrationOpen =
    manualOpen ||
    Boolean(
      achievement &&
        (newlyCreated || celebrateOnLoad) &&
        dismissedAchievementId !== achievement.id
    );
  const closeCelebration = () => {
    setManualOpen(false);
    setDismissedAchievementId(achievement?.id || '');
  };

  return (
    <>
      <section className="card space-y-5 p-5 sm:p-6" aria-labelledby="achievement-panel-title">
        <header className="flex items-start gap-3">
          <span className="icon-box h-10 w-10 bg-amber/15 text-accent">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <h2 id="achievement-panel-title" className="text-base font-extrabold text-ink">
              {t('achievement.sectionTitle')}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              {t('achievement.sectionSubtitle')}
            </p>
          </div>
        </header>

        {loading && !achievement ? (
          <div
            className="h-28 animate-pulse rounded-2xl bg-surface-muted"
            aria-label={t('achievement.loading')}
            role="status"
          />
        ) : achievement ? (
          <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
            <div className="overflow-hidden rounded-xl border border-line bg-[#f8f5ee] lg:col-span-8">
              <AchievementGraphic
                svgRef={svgRef}
                name={studentName}
                completedAt={achievement.completedAt}
              />
            </div>
            <div className="space-y-3 lg:col-span-4">
              <span className="chip bg-success-soft text-success-ink">
                <Sparkles className="h-3 w-3" />
                {t('achievement.completedStatus')}
              </span>
              <p className="text-xs leading-relaxed text-ink-muted">
                {t('achievement.dashboardMessage')}
              </p>
              <button
                type="button"
                onClick={() => setManualOpen(true)}
                className="btn-secondary w-full justify-center px-4 text-xs"
              >
                {t('achievement.reopen')}
              </button>
              <AchievementActions
                svgRef={svgRef}
                studentName={studentName}
                compact
              />
            </div>
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-danger/20 bg-danger-soft p-4 text-xs leading-relaxed text-danger">
            {t('achievement.loadError')}
          </p>
        ) : (
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-bold text-ink">{t('achievement.progressTitle')}</p>
              <p className="text-xs leading-relaxed text-ink-muted">
                {t('achievement.progressSummary', {
                  completed: progress?.completedLessons || 0,
                  total: progress?.totalLessons || 0,
                  passed: progress?.passedAssessments || 0,
                  assessments: progress?.totalAssessments || 0,
                })}
              </p>
            </div>
            <Link to="/courses" className="btn-primary shrink-0 justify-center px-4 text-xs">
              {t('achievement.continueLearning')}
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        )}
      </section>

      <AchievementCelebration
        open={celebrationOpen}
        onClose={closeCelebration}
        achievement={achievement}
        studentName={studentName}
      />
    </>
  );
}

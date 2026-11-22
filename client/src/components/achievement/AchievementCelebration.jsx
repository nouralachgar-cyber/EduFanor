import React, { useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from '../icons';
import AchievementActions from './AchievementActions';
import AchievementGraphic from './AchievementGraphic';

const confettiPieces = [
  { left: '12%', delay: 0, color: '#b89a5e' },
  { left: '22%', delay: 0.4, color: '#9b8cb3' },
  { left: '34%', delay: 0.8, color: '#6f557d' },
  { left: '47%', delay: 0.2, color: '#d7c49b' },
  { left: '61%', delay: 0.7, color: '#9b8cb3' },
  { left: '73%', delay: 0.3, color: '#b89a5e' },
  { left: '86%', delay: 0.9, color: '#6f557d' },
];

export default function AchievementCelebration({
  open,
  onClose,
  achievement,
  studentName,
}) {
  const { t, i18n } = useTranslation();
  const svgRef = useRef(null);
  const titleId = useId();
  const reducedMotion = useReducedMotion();
  const isAr = i18n.language === 'ar';

  return (
    <AnimatePresence>
      {open && achievement && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#1f1725]/70 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.section
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-[#faf8f4] p-4 shadow-2xl sm:p-7"
            initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {!reducedMotion && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 overflow-hidden" aria-hidden="true">
                {confettiPieces.map((piece) => (
                  <motion.span
                    key={`${piece.left}-${piece.delay}`}
                    className="absolute top-0 h-3 w-1.5 rounded-sm"
                    style={{ left: piece.left, backgroundColor: piece.color }}
                    initial={{ y: -16, opacity: 0, rotate: 0 }}
                    animate={{ y: 78, opacity: [0, 0.75, 0], rotate: 140 }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, delay: piece.delay }}
                  />
                ))}
              </div>
            )}

            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#806b91]">
                  {t('achievement.label')}
                </p>
                <h2 id={titleId} className="font-display text-2xl font-semibold text-[#34233f] sm:text-3xl">
                  {t('achievement.congratulations')}
                </h2>
                <p className="text-sm leading-relaxed text-[#655d68]">
                  {t('achievement.celebrationMessage')}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#e4dfea] bg-white p-2 text-[#655173] transition hover:bg-[#f1edf4]"
                aria-label={t('achievement.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-5 overflow-hidden rounded-xl border border-[#ded6e2] bg-[#f8f5ee] shadow-sm">
              <AchievementGraphic
                svgRef={svgRef}
                name={studentName}
                completedAt={achievement.completedAt}
              />
            </div>

            <div className="relative mt-5">
              <AchievementActions
                svgRef={svgRef}
                studentName={studentName}
              />
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

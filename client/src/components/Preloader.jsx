
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const INTRO_DURATION_MS = 2600;

const letters = 'EduFanor'.split('');

function prefersReducedMotion() {
  try {
    return typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  } catch {
    return false;
  }
}

export default function Preloader({ onDone }) {
  const reduceMotion = useRef(prefersReducedMotion()).current;
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;

    doneRef.current = true;
    setVisible(false);
    onDone?.();
  }, [onDone]);

  useEffect(() => {
    const timer = window.setTimeout(
      finish,
      reduceMotion ? 300 : INTRO_DURATION_MS
    );

    return () => window.clearTimeout(timer);
  }, [finish]); // reduceMotion is stable per mount

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="edufanor-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.15 : 0.55,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#E3E8F8] dark:bg-[#203562]"
          role="dialog"
          aria-label="EduFanor"
        >
          {/* Subtle background glow */}
          {!reduceMotion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#E3E8F8]/50 blur-[100px] dark:bg-[#C0C5CD]/15"
            />
          )}

          {/* Animated Brand Name */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={reduceMotion ? false : { scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h1
              className="relative flex items-center text-[clamp(2.8rem,9vw,5.5rem)] font-black tracking-[-0.065em]"
              aria-label="EduFanor"
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 35, filter: 'blur(10px)' }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }}
                  transition={{
                    duration: 0.55,
                    delay: reduceMotion ? 0 : index * 0.085,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block bg-gradient-to-r from-[#C0C5CD] via-[#C0C5CD] to-[#C0C5CD] bg-clip-text text-transparent dark:from-[#C0C5CD] dark:via-[#E3E8F8] dark:to-[#E9EFE8]"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            {/* Light sweep */}
            {!reduceMotion && (
              <motion.div
                initial={{ x: '-120%', opacity: 0 }}
                animate={{ x: '120%', opacity: [0, 0.8, 0] }}
                transition={{
                  delay: 0.9,
                  duration: 0.85,
                  ease: 'easeInOut',
                }}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-sm"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

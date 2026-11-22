
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import EduFanorWordmark from './EduFanorWordmark';

const INTRO_DURATION_MS = 2600;

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
  const { pathname } = useLocation();
  const isLoginRoute = pathname === '/login';
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
    if (isLoginRoute) {
      finish();
      return undefined;
    }

    const timer = window.setTimeout(
      finish,
      reduceMotion ? 300 : INTRO_DURATION_MS
    );

    return () => window.clearTimeout(timer);
  }, [finish, isLoginRoute]); // reduceMotion is stable per mount

  useEffect(() => {
    if (isLoginRoute) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoginRoute]);

  if (isLoginRoute) return null;

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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#F6F5F2] dark:bg-[#17313E]"
          role="dialog"
          aria-label="EduFanor"
        >
          <motion.div
            className="relative flex w-[min(76vw,22rem)] items-center justify-center"
            dir="ltr"
            style={{ unicodeBidi: 'isolate' }}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <EduFanorWordmark
              animated={!reduceMotion}
              className="w-full text-[#34233F] dark:text-[#FCFAFF]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

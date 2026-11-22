import React, { useId } from 'react';
import { motion } from 'framer-motion';

export default function EduFanorWordmark({ className = '', animated = false }) {
  const clipId = useId();

  return (
    <svg
      viewBox="0 0 240 72"
      role="img"
      aria-label="EduFanor"
      className={`block h-auto shrink-0 overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      dir="ltr"
      style={{ unicodeBidi: 'isolate' }}
    >
      {animated && (
        <defs>
          <clipPath id={clipId}>
            <motion.rect
              x="0"
              y="0"
              height="72"
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            />
          </clipPath>
        </defs>
      )}
      <text
        x="118"
        y="47"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="'DM Serif Display', 'Times New Roman', serif"
        fontSize="43"
        fontWeight="400"
        letterSpacing="-.7"
        direction="ltr"
        unicodeBidi="isolate"
        clipPath={animated ? `url(#${clipId})` : undefined}
      >
        EduFanor
      </text>
      <motion.path
        d="M29 54C77 68 157 65 211 47"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity=".78"
        initial={animated ? { pathLength: 0, opacity: 0 } : false}
        animate={animated ? { pathLength: 1, opacity: 0.78 } : undefined}
        transition={{ duration: 0.85, delay: 0.55, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d="M192 5L194.1 11.1L200 13.2L194.1 15.3L192 21.4L189.9 15.3L184 13.2L189.9 11.1L192 5Z"
        fill="currentColor"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={animated ? { opacity: 0, scale: 0.72 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

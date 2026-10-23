import React, { useId } from 'react';
import { HeartPulse, Wind, Droplets, CheckCircle2 } from 'lucide-react';

const VARIANTS = {
  cpr: {
    icon: HeartPulse,
    tile: 'bg-burgundy text-white',
    motif: (
      <svg
        viewBox="0 0 220 60"
        className="absolute bottom-3 start-0 w-full text-burgundy/30"
        fill="none"
        aria-hidden="true"
      >
        <polyline
          points="0,34 46,34 60,34 70,14 82,50 94,24 104,34 140,34 220,34"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  choking: {
    icon: Wind,
    tile: 'bg-navy text-teal',
    motif: (
      <svg
        viewBox="0 0 120 120"
        className="absolute -end-4 -top-4 h-32 w-32 text-navy/15"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" />
        <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 7" />
      </svg>
    ),
  },
  burns: {
    icon: Droplets,
    tile: 'bg-teal text-navy',
    motif: (
      <svg
        viewBox="0 0 120 120"
        className="absolute -end-2 -top-3 h-28 w-28 text-teal-deep/25"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M80 18c6 8 14 16 14 26a14 14 0 0 1-28 0c0-10 8-18 14-26z" opacity="0.55" />
        <path d="M44 46c4 5.4 9.5 10.8 9.5 17.6a9.5 9.5 0 0 1-19 0C34.5 56.8 40 51.4 44 46z" opacity="0.4" />
      </svg>
    ),
  },
};

export default function CourseArt({ category, completed = false }) {
  const patternId = useId();
  const variant = VARIANTS[category] || VARIANTS.cpr;
  const Icon = variant.icon;

  return (
    <div className="relative h-36 overflow-hidden rounded-t-2xl border-b border-line bg-cream">
      <svg className="absolute inset-0 h-full w-full text-navy/8" aria-hidden="true">
        <defs>
          <pattern id={patternId} width="26" height="26" patternUnits="userSpaceOnUse">
            <path
              d="M13 8.5v9M8.5 13h9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/40 to-cream" aria-hidden="true" />

      {variant.motif}

      <div className="relative z-10 flex h-full items-center justify-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ring-4 ring-white/60 ${variant.tile}`}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>

      {completed && (
        <span className="absolute top-3 end-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface text-success-ink shadow-md ring-1 ring-line">
          <CheckCircle2 className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

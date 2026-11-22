import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';

function formatCompletionDate(value, isAr) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(isAr ? 'ar' : 'en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export default function AchievementGraphic({ svgRef, name, completedAt, className = '' }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const id = useId().replace(/:/g, '');
  const isArabicName = /[\u0600-\u06ff]/i.test(name || '');
  const nameFontFamily = isArabicName
    ? "'IBM Plex Sans Arabic', 'Tajawal', sans-serif"
    : isAr
      ? "'IBM Plex Sans Arabic', 'Tajawal', sans-serif"
      : "'DM Serif Display', Georgia, serif";
  const fontFamily = isAr ? "'IBM Plex Sans Arabic', 'Tajawal', sans-serif" : "'Manrope', sans-serif";
  const displayFamily = isAr
    ? "'IBM Plex Sans Arabic', 'Tajawal', sans-serif"
    : "'DM Serif Display', Georgia, serif";
  const nameLength = Array.from(name || '').length;
  const nameSize = nameLength > 36 ? 30 : nameLength > 28 ? 36 : nameLength > 19 ? 46 : 54;

  return (
    <svg
      ref={svgRef}
      className={`block h-auto w-full ${className}`}
      viewBox="0 0 1200 800"
      width="1200"
      height="800"
      role="img"
      aria-labelledby={`achievement-title-${id} achievement-description-${id}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={`achievement-title-${id}`}>{t('achievement.graphicTitle')}</title>
      <desc id={`achievement-description-${id}`}>
        {t('achievement.graphicDescription', { name })}
      </desc>
      <defs>
        <linearGradient id={`achievement-accent-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#C5B0CD" />
          <stop offset="1" stopColor="#415E72" />
        </linearGradient>
        <pattern id={`achievement-pattern-${id}`} width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 22L22 0" stroke="#415E72" strokeOpacity=".12" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="1200" height="800" fill="#F6F5F2" />
      <rect x="22" y="22" width="1156" height="756" rx="18" fill="none" stroke={`url(#achievement-accent-${id})`} strokeWidth="2" />
      <rect x="36" y="36" width="1128" height="728" rx="12" fill="none" stroke="#C5B0CD" strokeOpacity=".82" strokeWidth="1.5" />
      <path d="M54 54H210V210H54z" fill={`url(#achievement-pattern-${id})`} />
      <path d="M1146 590v156H990" fill={`url(#achievement-pattern-${id})`} />
      <path d="M65 124h92M65 136h58M1135 124h-92M1135 136h-58" fill="none" stroke="#C5B0CD" strokeWidth="2" />
      <path d="M600 46v42m-12-21h24" stroke="#C5B0CD" strokeWidth="1.5" />

      <text
        x="600"
        y="124"
        textAnchor="middle"
        fill="#17313E"
        fontFamily={displayFamily}
        fontSize="42"
        fontWeight="500"
      >
        EduFanor
      </text>
      <path d="M420 151h360" stroke="#C5B0CD" strokeWidth="1.5" />

      <text
        x="600"
        y="204"
        textAnchor="middle"
        fill="#415E72"
        fontFamily={fontFamily}
        fontSize="17"
        fontWeight="800"
        letterSpacing={isAr ? '0' : '5'}
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.label').toLocaleUpperCase(isAr ? 'ar' : 'en')}
      </text>
      <text
        x="600"
        y="294"
        textAnchor="middle"
        fill="#17313E"
        fontFamily={displayFamily}
        fontSize={isAr ? '60' : '68'}
        fontWeight="500"
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.congratulations')}
      </text>
      <text
        x="600"
        y="354"
        textAnchor="middle"
        fill="#415E72"
        fontFamily={fontFamily}
        fontSize="25"
        fontWeight="700"
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.journeyCompleted')}
      </text>

      <text
        x="600"
        y="445"
        textAnchor="middle"
        fill="#17313E"
        fontFamily={nameFontFamily}
        fontSize={nameSize}
        fontWeight="500"
        textLength={nameLength > 40 ? 1000 : undefined}
        lengthAdjust="spacingAndGlyphs"
        direction={isArabicName ? 'rtl' : 'ltr'}
        unicodeBidi="plaintext"
      >
        {name}
      </text>
      <text
        x="600"
        y="500"
        textAnchor="middle"
        fill="#415E72"
        fontFamily={fontFamily}
        fontSize="20"
        fontWeight="500"
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.graphicMessageLine1')}
      </text>
      <text
        x="600"
        y="532"
        textAnchor="middle"
        fill="#415E72"
        fontFamily={fontFamily}
        fontSize="20"
        fontWeight="500"
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.graphicMessageLine2')}
      </text>

      <path d="M330 574h540" stroke="#C5B0CD" strokeWidth="1.5" />
      <text
        x="600"
        y="618"
        textAnchor="middle"
        fill="#415E72"
        fontFamily={fontFamily}
        fontSize="14"
        fontWeight="800"
        letterSpacing={isAr ? '0' : '2'}
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.completedOn')}
      </text>
      <text
        x="600"
        y="654"
        textAnchor="middle"
        fill="#17313E"
        fontFamily={fontFamily}
        fontSize="22"
        fontWeight="700"
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {formatCompletionDate(completedAt, isAr)}
      </text>
      <text
        x="600"
        y="710"
        textAnchor="middle"
        fill="#415E72"
        fontFamily={fontFamily}
        fontSize="12"
        fontWeight="500"
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.disclaimer')}
      </text>
      <text
        x="600"
        y="744"
        textAnchor="middle"
        fill="#415E72"
        fontFamily={fontFamily}
        fontSize="13"
        fontWeight="700"
        letterSpacing={isAr ? '0' : '1'}
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {t('achievement.footer')}
      </text>
    </svg>
  );
}

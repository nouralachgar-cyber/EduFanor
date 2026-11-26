const ARABIC_INDIC_DIGITS = /[\u0660-\u0669]/g;
const EXTENDED_ARABIC_INDIC_DIGITS = /[\u06F0-\u06F9]/g;

export function toWesternDigits(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(ARABIC_INDIC_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(EXTENDED_ARABIC_INDIC_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x06F0));
}

export function isArabicLanguage(language) {
  return String(language || '').toLowerCase().startsWith('ar');
}

export function getNumberingLocale(language, arabicLocale = 'ar-EG') {
  const base = isArabicLanguage(language) ? arabicLocale : 'en-US';
  return `${base}-u-nu-latn`;
}

export function formatNumber(value, language) {
  const numeric = Number(value);
  if (value === null || value === undefined || value === '' || Number.isNaN(numeric)) return '—';
  return toWesternDigits(new Intl.NumberFormat(getNumberingLocale(language)).format(numeric));
}

export function formatPercent(value, language) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '—';
  return `${formatNumber(value, language)}%`;
}

export function formatDate(value, language, options = {}, arabicLocale = 'ar-EG') {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const config = Object.keys(options).length ? options : { dateStyle: 'medium' };
  return toWesternDigits(
    new Intl.DateTimeFormat(getNumberingLocale(language, arabicLocale), config).format(date)
  );
}

export function formatDateTime(value, language) {
  return formatDate(value, language, { dateStyle: 'medium', timeStyle: 'short' });
}

export function relativeTime(value, language) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const units = [
    ['year', 31536000000],
    ['month', 2592000000],
    ['day', 86400000],
    ['hour', 3600000],
    ['minute', 60000],
  ];
  const formatter = new Intl.RelativeTimeFormat(getNumberingLocale(language, 'ar'), {
    numeric: 'auto',
  });
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'minute') {
      return toWesternDigits(formatter.format(Math.round(diff / ms), unit));
    }
  }
  return '—';
}

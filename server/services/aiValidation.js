const { AiServiceError } = require('./grokService');

const normalizeLanguage = (value) => {
  const lang = String(value || '').toLowerCase();
  if (lang.startsWith('ar')) return 'ar';
  return 'en';
};

const normalizeDifficulty = (value) => {
  const level = String(value || '').toLowerCase();
  if (['easy', 'medium', 'hard'].includes(level)) return level;
  return 'medium';
};

function clipString(value, maxLength) {
  return String(value ?? '')
    .replace(/\s+\n/g, '\n')
    .trim()
    .slice(0, maxLength);
}

function requireString(value, field, { min = 1, max = 2000 } = {}) {
  const text = clipString(value, max);
  if (text.length < min) {
    throw new AiServiceError(`Missing or empty field: ${field}`, 'VALIDATION_ERROR', 400);
  }
  return text;
}

function optionalString(value, { max = 4000 } = {}) {
  return clipString(value, max);
}

const isValidObjectIdLike = (value) =>
  typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

function sanitizeMessageForPrompt(text) {
  return clipString(text, 4000)
    .replace(/\u0000/g, '')
    .replace(/< shiny |<\/?lesson_data>/gi, '');
}

module.exports = {
  normalizeLanguage,
  normalizeDifficulty,
  clipString,
  requireString,
  optionalString,
  isValidObjectIdLike,
  sanitizeMessageForPrompt,
};

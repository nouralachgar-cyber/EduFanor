const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  buildQuizDraftPrompt,
  normalizeQuizDraft,
  isDraftGrounded,
} = require('../services/aiQuizService');

const material = [
  'Lesson title (English): First aid for burns',
  'Lesson content (English): Cool the burn under running water for twenty minutes.',
  'Safety notes (English): Do not apply ice directly.',
].join('\n');

test('quiz draft prompt forbids invented facts and requires a bilingual JSON shape', () => {
  const prompt = buildQuizDraftPrompt({ level: 'medium', language: 'en' });

  assert.match(prompt, /only source of truth/);
  assert.match(prompt, /Never invent facts/);
  assert.match(prompt, /"question":\{"ar"/);
  assert.match(prompt, /correctIndex/);
  assert.match(prompt, /explanation/);
});

test('quiz draft normalization keeps the AI-chosen correct index', () => {
  const draft = normalizeQuizDraft({
    question: { ar: 'كيف تُبرَّد الحروق؟', en: 'How should burns be cooled?' },
    options: [
      { ar: 'ماء جاري', en: 'Running water' },
      { ar: 'ثلج مباشر', en: 'Ice directly' },
      { ar: 'زيت', en: 'Oil' },
    ],
    correctIndex: 0,
    explanation: { ar: 'الماء الجاري هو المذكور في الدرس.', en: '' },
  });

  assert.equal(draft.suggestedCorrectIndex, 0);
  assert.equal(draft.explanation.en, 'الماء الجاري هو المذكور في الدرس.');
  assert.deepEqual(draft.options.en, ['Running water', 'Ice directly', 'Oil']);
});

test('quiz draft normalization rejects an invalid correct index', () => {
  assert.throws(
    () =>
      normalizeQuizDraft({
        question: { ar: 'سؤال', en: 'Question' },
        options: [
          { ar: 'أ', en: 'A' },
          { ar: 'ب', en: 'B' },
          { ar: 'ج', en: 'C' },
        ],
      }),
    (error) => error.code === 'AI_BAD_OUTPUT'
  );
});

test('quiz draft grounding accepts lesson-supported answers and rejects invented answers', () => {
  const grounded = {
    question: { ar: 'كيف تُبرَّد الحروق؟', en: 'How should burns be cooled?' },
    options: { ar: ['ماء جاري', 'ثلج', 'زيت'], en: ['Running water', 'Ice', 'Oil'] },
    suggestedCorrectIndex: 0,
    explanation: { ar: 'الماء الجاري مذكور في الدرس.', en: 'Running water is in the lesson.' },
  };
  const invented = {
    ...grounded,
    options: { ar: ['زيت', 'ثلج', 'ملح'], en: ['Oil', 'Ice', 'Salt'] },
    explanation: { ar: 'الدرس يقول استخدم زيت.', en: 'The lesson says to use oil.' },
  };

  assert.equal(isDraftGrounded(grounded, material), true);
  assert.equal(isDraftGrounded(invented, material), false);
});

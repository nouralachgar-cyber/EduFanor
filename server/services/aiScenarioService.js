const mongoose = require('mongoose');
const AiScenario = require('../models/AiScenario');
const { AiServiceError, chatCompletion, parseJsonContent } = require('./grokService');
const { normalizeLanguage, normalizeDifficulty, requireString } = require('./aiValidation');

const fallbackScenarioStore = new Map();
const FALLBACK_TTL_MS = 30 * 60 * 1000;
const FALLBACK_MAX = 150;

const TOPICS = ['choking', 'burn', 'unconscious', 'cardiac', 'bleeding', 'injury', 'surprise'];

function pruneFallback() {
  const now = Date.now();
  for (const [key, entry] of fallbackScenarioStore) {
    if (now - entry.createdAt > FALLBACK_TTL_MS) fallbackScenarioStore.delete(key);
    if (fallbackScenarioStore.size <= FALLBACK_MAX) break;
  }
}

const cleanText = (value, max = 500) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

// تعريف الدالة المفقودة لتفادي أي خطأ
function quickScenarioValidate(data) {
  return Boolean(data);
}

const TOPIC_GUIDE = {
  choking: 'an airway obstruction / choking incident',
  burn: 'a household burn incident',
  unconscious: 'finding an unresponsive person',
  cardiac: 'a suspected cardiac arrest situation',
  bleeding: 'a severe bleeding incident',
  injury: 'an everyday injury that needs a safe first-aid response',
  surprise: 'a realistic first-aid situation of your choice (common, medically sound)',
};

function buildScenarioPrompt(lang, topicGuide) {
  const jsonShape =
    '{"title": "...", "narrative": "...", "question": "...", "options": [{"label": "...", "isBest": true, "feedback": "..."}, {"label": "...", "isBest": false, "feedback": "..."}, ...], "suggestedLessonTitle": "..."}';

  if (lang === 'ar') {
    return `أنت مصمم سيناريوهات تدريبية لمنصة EduFanor لتعلم الإسعافات الأولية. صمم سيناريو تعليمياً واقعياً حول: ${topicGuide}.

متطلبات السيناريو:
- يفتح بوصفة واضحة لما يحدث: من حاضر، أين، وحالة المصاب الظاهرة (40-100 كلمة).
- ثم سؤال محدد: "ما أول تصرف سليم؟" مع 4 خيارات: واحد سليم تماماً، واحد بالإغراء لكنه غير كاف، واحد خطِر فعلاً، وواحد خاطئ لسبب دقيق.
- افصل بين الخيارات بوضع مسافة سطرية.
- علماً أن السيناريو للتعلم التدريبي وليس حالة طارئة حقيقية.

أخرج JSON فقط بالشكل التالي:
${jsonShape}

شرط صارم: الخيارات 4 بالضبط، وعبارة "isBest" صحيحة لواحد فقط. لكل خيار "feedback" من 20-70 كلمة يوضح لماذا هو جيد أو غير كافٍ أو خطِر وما التصرف البديل الصحيح. يجب ألا يكافئ أي خيار خطِر أبداً. "suggestedLessonTitle" هو اسم درس مناسب موجودة على المنصة إن لزم، وإلا فاتركه فارغاً. اكتب كل النصوص بالعربية الفصحى المبسطة (المصطلحات مثل CPR تبقى لاتينية).`;
  }

  return `You design training scenarios for EduFanor, a first-aid learning platform. Write an educational scenario about: ${topicGuide}.

Requirements:
- Open with a clear depiction of the situation: who is present, where, apparent state of the victim (40-100 words).
- Then pose the exact question "What is the correct FIRST action?" with 4 choices: one clearly best, one tempting but insufficient, one actively dangerous, one subtly wrong.
- Make each option's consequence distinct.
- Note that this is a training exercise, not a live emergency.

Output ONLY JSON in this exact shape:
${jsonShape}

Hard rules: exactly 4 options, exactly one with "isBest": true. Each option needs "feedback" of 20-70 words explaining right/insufficient/dangerous and the better action. Feedback must NEVER reward dangerous actions; firmly correct unsafe choices. "suggestedLessonTitle" is a fitting EduFanor lesson name, or empty. Write everything in simple English.`;
}

async function generateScenario({ topic, difficulty, language, requesterId }) {
  const lang = normalizeLanguage(language);
  const level = normalizeDifficulty(difficulty);
  const chosenTopic = TOPICS.includes(topic) ? topic : 'surprise';
  const topicGuide = TOPIC_GUIDE[chosenTopic];

  const result = await chatCompletion({
    messages: [
      { role: 'system', content: buildScenarioPrompt(lang, topicGuide) },
      {
        role: 'user',
        content: `Difficulty: ${level}. This scenario is for TRAINING ONLY inside the EduFanor lesson experience.`,
      },
    ],
    maxTokens: 1800,
    temperature: 0.8,
    json: true,
  });

  const parsed = parseJsonContent(result.content);
  const narrative = String(parsed?.narrative ?? '').trim().slice(0, 2000);
  const question = cleanText(parsed?.question, 200);
  const rawOptions = Array.isArray(parsed?.options) ? parsed.options : [];

  const options = rawOptions
    .map((option) => ({
      label: cleanText(option?.label, 160),
      isBest: Boolean(option?.isBest),
      feedback: String(option?.feedback ?? '').trim().slice(0, 700),
    }))
    .filter((option) => option.label)
    .slice(0, 4);

  const bestCount = options.filter((option) => option.isBest).length;
  if (narrative.length < 60 || !question || options.length < 3 || bestCount !== 1) {
    throw new AiServiceError(
      'The generated scenario failed validation. Please try again.',
      'AI_BAD_OUTPUT',
      502
    );
  }

  const payload = {
    topic: chosenTopic,
    difficulty: level,
    language: lang,
    title: cleanText(parsed?.title, 140) || cleanText(topicGuide, 140),
    narrative,
    question,
    options,
    suggestedLessonTitle: cleanText(parsed?.suggestedLessonTitle, 160),
    model: result.model,
  };

  let id = `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  let ephemeral = true;
  try {
    const doc = await AiScenario.create({ requester: requesterId, ...payload });
    id = String(doc._id);
    ephemeral = false;
  } catch {
    pruneFallback();
    fallbackScenarioStore.set(id, { ...payload, createdAt: Date.now() });
  }

  return {
    kind: 'scenario',
    scenario: {
      id,
      ephemeral,
      title: payload.title,
      narrative,
      question,
      options: options.map((option) => ({ label: option.label })),
      suggestedLessonTitle: payload.suggestedLessonTitle,
      difficulty: level,
    },
    model: result.model,
  };
}

async function evaluateScenarioAnswer({ scenarioId, optionIndex }) {
  if (typeof scenarioId !== 'string' || scenarioId.length < 6) return null;
  const index = Number(optionIndex);

  let scenario = null;
  let ephemeral = false;
  if (scenarioId.startsWith('mem_')) {
    const entry = fallbackScenarioStore.get(scenarioId);
    if (!entry) return null;
    scenario = entry;
    ephemeral = true;
  } else {
    if (!/^[a-f\d]{24}$/i.test(scenarioId)) return null;
    const doc = await AiScenario.findById(scenarioId).lean();
    if (!doc) return null;
    scenario = doc;
  }

  if (!scenario || !Array.isArray(scenario.options)) return null;
  if (!Number.isInteger(index) || index < 0 || index >= scenario.options.length) return null;

  const chosen = scenario.options[index];
  const isBest = Boolean(chosen?.isBest);

  if (ephemeral) {
    fallbackScenarioStore.delete(String(scenarioId));
  }

  return {
    kind: 'scenarioFeedback',
    correct: isBest,
    feedback: String(chosen?.feedback ?? '').slice(0, 900),
    correctOptionLabel: String(scenario.options.find((option) => option.isBest)?.label ?? ''),
    suggestedLessonTitle: String(scenario?.suggestedLessonTitle ?? '').slice(0, 160),
    title: String(scenario?.title ?? ''),
    question: String(scenario?.question ?? ''),
  };
}

module.exports = {
  generateScenario,
  evaluateScenarioAnswer,
  quickScenarioValidate,
};
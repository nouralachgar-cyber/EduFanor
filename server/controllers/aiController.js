const grokService = require('../services/grokService');
const features = require('../services/aiFeatures');
const quizService = require('../services/aiQuizService');
const scenarioService = require('../services/aiScenarioService');
const {
  requireString,
  optionalString,
  normalizeLanguage,
  isValidObjectIdLike,
} = require('../services/aiValidation');
const { AiServiceError } = require('../services/grokService');

function send(error, lang, res) {
  const isAr = normalizeLanguage(lang) === 'ar';
  const arabicCodes = {
    AI_NOT_CONFIGURED: 'خدمة الذكاء الاصطناعي غير مفعّلة على الخادم بعد.',
    AI_KEY_INVALID: 'مفتاح الذكاء الاصطناعي غير مستقبَل من مزوّد الخدمة. تحقق من إعدادات الخادم.',
    AI_RATE_LIMITED: 'عدد طلبيات الذكاء الاصطناعي كثير حالياً، أعد المحاولة بعد قليل.',
    AI_TIMEOUT: 'استغرقت الإجابة وقتاً طويلاً. أعد المحاولة.',
    AI_BAD_OUTPUT: 'لم تكتمل الإجابة بشكل صحيح. أعد المحاولة.',
    AI_UPSTREAM_ERROR: 'تعذر الاتصال بخدمة الذكاء الاصطناعي الآن.',
    AI_NO_MODEL: 'لا يتوفر نموذج ذكاء اصطناعي مناسب لحساب الخدمة.',
    VALIDATION_ERROR: 'بيانات الطلب غير صالحة.',
    AI_LESSON_EMPTY: 'هذا الدرس لا يحتوي بعد على محتوى كافٍ.',
    AI_NO_CATALOG: 'لا توجد دروس منشورة بعد لإنشاء خطة تفوق عليها.',
    AI_UNKNOWN_TASK: 'مهمة الذكاء الاصطناعي غير معروفة.',
  };
  if (error instanceof AiServiceError) {
    return res.status(error.status || 502).json({
      message: isAr ? arabicCodes[error.code] || error.message : error.message,
      code: error.code,
    });
  }
  return res.status(500).json({
    message: isAr ? 'خطأ غير متوقع في خدمة الذكاء الاصطناعي.' : 'Unexpected AI service error.',
    code: 'AI_ERROR',
  });
}

const readInlineLesson = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const title = optionalString(raw.title, { max: 200 });
  const content = optionalString(raw.content ?? raw.text, { max: 6000 });
  if (!title || !content) return null;
  return {
    title,
    content,
    safetyNotes: optionalString(raw.safetyNotes, { max: 1500 }),
    courseTitle: optionalString(raw.courseTitle, { max: 200 }),
  };
};

function aiHealth(res, lang) {
  const isAr = normalizeLanguage(lang) === 'ar';
  if (!grokService.isConfigured()) {
    return res.status(503).json({
      ok: false,
      code: 'AI_NOT_CONFIGURED',
      message: isAr
        ? 'مفتاح الذكاء الاصطناعي غير مضبوط على الخادم (GROK_API_KEY).'
        : 'The AI key is not configured on the server (GROK_API_KEY).',
      model: null,
    });
  }
  grokService
    .resolveModel()
    .then((model) => res.json({ ok: true, model }))
    .catch((error) => send(error, lang, res));
}

async function chat(req, res) {
  const lang = normalizeLanguage(req.body?.language || req.user?.language || req.i18nLang);
  try {
    const message = requireString(req.body?.message, 'message', { min: 2, max: 4000 });
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
    const data = await features.runAssistantChat({ history, message, language: lang });
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function explainLesson(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const data = await features.runLessonExplanation({
      lessonId: isValidObjectIdLike(req.body?.lessonId) ? req.body.lessonId : null,
      inline: readInlineLesson(req.body?.inline),
      language: lang,
      depth: req.body?.depth === 'concise' ? 'concise' : 'standard',
    });
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function summarizeLesson(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const data = await features.runLessonSummary({
      lessonId: isValidObjectIdLike(req.body?.lessonId) ? req.body.lessonId : null,
      inline: readInlineLesson(req.body?.inline),
      language: lang,
    });
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function studyPlan(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const data = await features.runStudyPlan({ userId: req.user._id, language: lang });
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function generateQuiz(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const count = Number(req.body?.count);
    const data = await quizService.generateFullQuiz({
      language: lang,
      difficulty: req.body?.difficulty,
      count,
      lessonId: isValidObjectIdLike(req.body?.lessonId) ? req.body.lessonId : null,
      inline: readInlineLesson(req.body?.inline),
      requesterId: req.user._id,
    });
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function evaluateQuiz(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const quizIdRaw = req.body?.quizId;
    const quizId =
      typeof quizIdRaw === 'string' && (isValidObjectIdLike(quizIdRaw) || quizIdRaw.startsWith('mem_'))
        ? quizIdRaw
        : null;
    const answers = Array.isArray(req.body?.answers) ? req.body.answers.slice(0, 12) : null;
    if (!quizId || !answers) {
      throw new AiServiceError('Invalid quiz submission payload.', 'VALIDATION_ERROR', 400);
    }
    const data = await quizService.evaluateQuizAnswers({ quizId, answers, requesterId: req.user._id });
    if (!data) {
      throw new AiServiceError('This quiz session is no longer available.', 'QUIZ_NOT_FOUND', 404);
    }
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function scenarioGenerate(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const topicRaw = await scenarioService.quickScenarioValidate({ topic: req.body?.topic });
    const data = await scenarioService.generateScenario({
      topic: topicRaw,
      difficulty: req.body?.difficulty,
      language: lang,
      requesterId: req.user._id,
    });
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function scenarioEvaluate(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const data = await scenarioService.evaluateScenarioAnswer({
      scenarioId: typeof req.body?.scenarioId === 'string' ? req.body.scenarioId : '',
      optionIndex: req.body?.optionIndex,
    });
    if (!data) {
      throw new AiServiceError('This scenario session is no longer available.', 'SCENARIO_NOT_FOUND', 404);
    }
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

async function adminGenerate(req, res) {
  const lang = normalizeLanguage(req.body?.language);
  try {
    const task = requireString(req.body?.task, 'task', { min: 2, max: 40 });
    const source = req.body?.source && typeof req.body?.source === 'object' ? req.body.source : {};
    const allowedKeys = ['existingTitle', 'existingDescription', 'courseTitle', 'lessonId'];
    const safeSource = {};
    allowedKeys.forEach((key) => {
      if (source[key] !== undefined) safeSource[key] = optionalString(String(source[key]), { max: 4000 });
    });

    const data = await features.runAdminGeneration({
      task,
      language: lang,
      sourceText: optionalString(req.body?.sourceText, { max: 6000 }),
      source: safeSource,
      options: { difficulty: req.body?.difficulty },
    });
    return res.json(data);
  } catch (error) {
    return send(error, lang, res);
  }
}

module.exports = {
  aiHealth,
  chat,
  explainLesson,
  summarizeLesson,
  studyPlan,
  generateQuiz,
  evaluateQuiz,
  scenarioGenerate,
  scenarioEvaluate,
  adminGenerate,
};

import { apiRequest } from './api';

const REQUEST_TIMEOUT_MS = 90 * 1000;

function buildAbortSignal() {
  if (typeof AbortController !== 'function') return {};
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return { signal: controller.signal, cleanup: () => window.clearTimeout(timer) };
}

async function aiPost(path, body) {
  const { signal, cleanup } = buildAbortSignal();
  try {
    return await apiRequest(path, { method: 'POST', body, auth: true, signal });
  } finally {
    if (cleanup) cleanup();
  }
}

export const aiApi = {
  health: () => apiRequest('/ai/health', { auth: true }),

  chat: ({ message, history = [], language }) =>
    aiPost('/ai/chat', { message, history, language }),

  explainLesson: ({ lessonId, inline, language, depth }) =>
    aiPost('/ai/explain-lesson', { lessonId, inline, language, depth }),

  summarize: ({ lessonId, inline, language }) =>
    aiPost('/ai/summarize', { lessonId, inline, language }),

  studyPlan: ({ language }) => aiPost('/ai/study-plan', { language }),

  generateQuiz: ({ lessonId, inline, language, difficulty = 'medium', count = 5 }) =>
    aiPost('/ai/generate-quiz', { lessonId, inline, language, difficulty, count }),

  evaluateQuiz: ({ quizId, answers, language }) =>
    aiPost('/ai/evaluate-quiz', { quizId, answers, language }),

  scenario: ({ topic = 'surprise', difficulty = 'medium', language }) =>
    aiPost('/ai/scenario', { topic, difficulty, language }),

  evaluateScenario: ({ scenarioId, optionIndex, language }) =>
    aiPost('/ai/evaluate-scenario', { scenarioId, optionIndex, language }),

  adminGenerate: ({ task, language, sourceText, source, difficulty }) =>
    aiPost('/ai/admin/generate', { task, language, sourceText, source, difficulty }),
};

export function localizeAiError(error, isAr) {
  const fallback = isAr
    ? 'تعذر إتمام طلب الذكاء الاصطناعي. حاول مرة أخرى.'
    : 'The AI request could not be completed. Please try again.';
  return error?.message || fallback;
}

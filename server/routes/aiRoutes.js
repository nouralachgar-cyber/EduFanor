const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { rateLimit } = require('../middleware/rateLimit');
const ai = require('../controllers/aiController');

router.get('/health', protect, ai.aiHealth);

router.post(
  '/chat',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 25, scope: 'ai-chat' }),
  ai.chat
);

router.post(
  '/explain-lesson',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 12, scope: 'ai-explain' }),
  ai.explainLesson
);

router.post(
  '/summarize',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 12, scope: 'ai-summary' }),
  ai.summarizeLesson
);

router.post(
  '/study-plan',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 8, scope: 'ai-plan' }),
  ai.studyPlan
);

router.post(
  '/generate-quiz',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 8, scope: 'ai-quiz' }),
  ai.generateQuiz
);

router.post(
  '/evaluate-quiz',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 30, scope: 'ai-quiz-eval' }),
  ai.evaluateQuiz
);

router.post(
  '/scenario',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 10, scope: 'ai-scenario' }),
  ai.scenarioGenerate
);

router.post(
  '/evaluate-scenario',
  protect,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 30, scope: 'ai-scenario-eval' }),
  ai.scenarioEvaluate
);

router.post(
  '/admin/generate',
  protect,
  adminOnly,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 25, scope: 'ai-admin' }),
  ai.adminGenerate
);

module.exports = router;

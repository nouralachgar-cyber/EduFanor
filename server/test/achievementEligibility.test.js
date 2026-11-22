const test = require('node:test');
const assert = require('node:assert/strict');
const evaluateAchievementEligibility = require('../services/achievementEligibility');

test('requires every published lesson to be verified complete', () => {
  const result = evaluateAchievementEligibility({
    requiredLessonIds: ['lesson-1', 'lesson-2'],
    requiredQuizIds: [],
    verifiedCompletedLessonIds: ['lesson-1'],
    verifiedPassedQuizIds: []
  });

  assert.equal(result.eligible, false);
  assert.equal(result.completedLessonCount, 1);
});

test('requires every published assessment to have a verified passing attempt', () => {
  const result = evaluateAchievementEligibility({
    requiredLessonIds: ['lesson-1'],
    requiredQuizIds: ['quiz-1'],
    verifiedCompletedLessonIds: ['lesson-1'],
    verifiedPassedQuizIds: []
  });

  assert.equal(result.eligible, false);
  assert.equal(result.passedAssessmentCount, 0);
});

test('allows completed lessons when the published curriculum has no assessments', () => {
  const result = evaluateAchievementEligibility({
    requiredLessonIds: ['lesson-1'],
    requiredQuizIds: [],
    verifiedCompletedLessonIds: ['lesson-1'],
    verifiedPassedQuizIds: []
  });

  assert.equal(result.eligible, true);
});

test('allows an eligible journey and does not inflate counts for duplicate records', () => {
  const result = evaluateAchievementEligibility({
    requiredLessonIds: ['lesson-1', 'lesson-2', 'lesson-2'],
    requiredQuizIds: ['quiz-1'],
    verifiedCompletedLessonIds: ['lesson-1', 'lesson-2', 'lesson-2'],
    verifiedPassedQuizIds: ['quiz-1', 'quiz-1']
  });

  assert.equal(result.eligible, true);
  assert.equal(result.lessonCount, 2);
  assert.equal(result.assessmentCount, 1);
});

test('does not award an empty curriculum', () => {
  const result = evaluateAchievementEligibility({
    requiredLessonIds: [],
    requiredQuizIds: [],
    verifiedCompletedLessonIds: [],
    verifiedPassedQuizIds: []
  });

  assert.equal(result.eligible, false);
});

test('achievement and assessment endpoint modules load without connecting to a database', () => {
  assert.doesNotThrow(() => {
    require('../controllers/achievementController');
    require('../controllers/progressController');
    require('../controllers/quizController');
    require('../routes/achievementRoutes');
    require('../routes/progressRoutes');
    require('../routes/quizRoutes');
  });
});

function toIdSet(values) {
  return new Set((Array.isArray(values) ? values : []).filter(Boolean).map(String));
}

function evaluateAchievementEligibility({
  requiredLessonIds,
  requiredQuizIds,
  verifiedCompletedLessonIds,
  verifiedPassedQuizIds
}) {
  const requiredLessons = [...toIdSet(requiredLessonIds)];
  const requiredQuizzes = [...toIdSet(requiredQuizIds)];
  const completedLessons = toIdSet(verifiedCompletedLessonIds);
  const passedQuizzes = toIdSet(verifiedPassedQuizIds);
  const completedLessonCount = requiredLessons.filter((id) => completedLessons.has(id)).length;
  const passedQuizCount = requiredQuizzes.filter((id) => passedQuizzes.has(id)).length;

  return {
    eligible:
      requiredLessons.length > 0 &&
      completedLessonCount === requiredLessons.length &&
      passedQuizCount === requiredQuizzes.length,
    lessonCount: requiredLessons.length,
    completedLessonCount,
    assessmentCount: requiredQuizzes.length,
    passedAssessmentCount: passedQuizCount
  };
}

module.exports = evaluateAchievementEligibility;

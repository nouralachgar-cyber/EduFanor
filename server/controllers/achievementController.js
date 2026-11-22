const { getOrCreateLearningAchievement } = require('../services/learningAchievementService');

const getMyAchievement = async (req, res) => {
  try {
    const result = await getOrCreateLearningAchievement(req.user._id);
    return res.json({
      achievement: result.achievement
        ? {
            id: String(result.achievement._id),
            completedAt: result.achievement.completedAt,
            lessonCount: result.achievement.lessonCount,
            assessmentCount: result.achievement.assessmentCount
          }
        : null,
      newlyCreated: result.newlyCreated,
      progress: {
        completedLessons: result.status.completedLessonCount,
        totalLessons: result.status.lessonCount,
        passedAssessments: result.status.passedAssessmentCount,
        totalAssessments: result.status.assessmentCount
      },
      studentName: req.user.name
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load learning achievement: ' + error.message });
  }
};

module.exports = { getMyAchievement };

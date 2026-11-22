const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const LearningAchievement = require('../models/LearningAchievement');
const evaluateAchievementEligibility = require('./achievementEligibility');

async function getLearningStatus(userId) {
  const courses = await Course.find({ published: true }).select('_id').lean();
  const courseIds = courses.map((course) => course._id);
  const lessons = courseIds.length
    ? await Lesson.find({ course: { $in: courseIds }, published: true }).select('_id').lean()
    : [];
  const lessonIds = lessons.map((lesson) => lesson._id);
  const quizzes = lessonIds.length
    ? await Quiz.find({ lesson: { $in: lessonIds }, published: true }).select('_id').lean()
    : [];
  const progressRecords = await Progress.find({ user: userId })
    .select('verifiedCompletedLessons quizAttempts')
    .lean();

  const verifiedCompletedLessonIds = progressRecords.flatMap(
    (progress) => progress.verifiedCompletedLessons || []
  );
  const verifiedPassedQuizIds = progressRecords.flatMap(
    (progress) => progress.quizAttempts || []
  )
    .filter((attempt) => attempt.verified === true && attempt.passed === true && attempt.quiz)
    .map((attempt) => attempt.quiz);

  const status = evaluateAchievementEligibility({
    requiredLessonIds: lessonIds,
    requiredQuizIds: quizzes.map((quiz) => quiz._id),
    verifiedCompletedLessonIds,
    verifiedPassedQuizIds
  });

  return status;
}

async function getOrCreateLearningAchievement(userId) {
  const existing = await LearningAchievement.findOne({ user: userId }).lean();
  const status = await getLearningStatus(userId);
  if (existing) return { achievement: existing, newlyCreated: false, status };
  if (!status.eligible) return { achievement: null, newlyCreated: false, status };

  try {
    const achievement = await LearningAchievement.create({
      user: userId,
      completedAt: new Date(),
      lessonCount: status.lessonCount,
      assessmentCount: status.assessmentCount
    });
    return { achievement: achievement.toObject(), newlyCreated: true, status };
  } catch (error) {
    if (error.code !== 11000) throw error;
    const achievement = await LearningAchievement.findOne({ user: userId }).lean();
    if (!achievement) throw error;
    return { achievement, newlyCreated: false, status };
  }
}

module.exports = { getLearningStatus, getOrCreateLearningAchievement };

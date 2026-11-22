const Progress = require('../models/Progress');
const ActivityEvent = require('../models/ActivityEvent');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');
const { getOrCreateLearningAchievement } = require('../services/learningAchievementService');

const allowedTypes = new Set(['course_start', 'course_complete', 'lesson_complete', 'quiz_attempt']);

const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id })
      .populate({ path: 'completedLessons', select: 'title order course', populate: { path: 'course', select: 'title slug' } })
      .populate({ path: 'quizAttempts.lesson', select: 'title course', populate: { path: 'course', select: 'title slug' } })
      .lean();
    const events = await ActivityEvent.find({ user: req.user._id })
      .sort('-occurredAt')
      .limit(50)
      .populate({ path: 'lesson', select: 'title course', populate: { path: 'course', select: 'title slug' } })
      .lean();
    return res.json({ progress: progress || null, events });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load progress: ' + error.message });
  }
};

const getPublishedLesson = async (lessonId) => {
  if (!mongoose.isValidObjectId(lessonId)) return null;
  const lesson = await Lesson.findById(lessonId)
    .populate({ path: 'course', select: 'published slug' })
    .lean();
  return lesson?.published && lesson.course?.published ? lesson : null;
};

const getEarlierPublishedLessons = async (lesson) => {
  const lessons = await Lesson.find({ course: lesson.course._id, published: true })
    .sort({ order: 1, _id: 1 })
    .select('_id')
    .lean();
  const targetIndex = lessons.findIndex((item) => String(item._id) === String(lesson._id));
  return targetIndex < 0 ? null : lessons.slice(0, targetIndex).map((item) => item._id);
};

const getOrCreateProgress = (userId) =>
  Progress.findOneAndUpdate(
    { user: userId },
    { $set: { lastActive: new Date() } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

const startLesson = async (req, res) => {
  try {
    const lesson = await getPublishedLesson(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Published lesson not found', code: 'LESSON_NOT_FOUND' });

    const progress = await Progress.findOne({ user: req.user._id }).select('verifiedCompletedLessons');
    const completedIds = new Set((progress?.verifiedCompletedLessons || []).map(String));
    const earlierLessonIds = await getEarlierPublishedLessons(lesson);
    if (earlierLessonIds === null) {
      return res.status(404).json({ message: 'Published lesson not found', code: 'LESSON_NOT_FOUND' });
    }
    if (earlierLessonIds.some((id) => !completedIds.has(String(id)))) {
      return res.status(409).json({
        message: 'Complete earlier lessons in this course first.',
        code: 'PREVIOUS_LESSONS_REQUIRED'
      });
    }

    const updatedProgress = await getOrCreateProgress(req.user._id);
    const alreadyStarted = updatedProgress.lessonStarts.some(
      (entry) => String(entry.lesson) === String(lesson._id)
    );
    if (!alreadyStarted) {
      updatedProgress.lessonStarts.push({ lesson: lesson._id, startedAt: new Date() });
    }
    updatedProgress.lastActive = new Date();
    await updatedProgress.save();
    return res.json({ started: true });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to start lesson: ' + error.message });
  }
};

const completeLesson = async (req, res) => {
  try {
    const lesson = await getPublishedLesson(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Published lesson not found', code: 'LESSON_NOT_FOUND' });

    const progress = await Progress.findOne({ user: req.user._id });
    if (!progress?.lessonStarts.some((entry) => String(entry.lesson) === String(lesson._id))) {
      return res.status(409).json({
        message: 'Start this lesson before completing it.',
        code: 'LESSON_NOT_STARTED'
      });
    }

    const earlierLessonIds = await getEarlierPublishedLessons(lesson);
    if (earlierLessonIds === null) {
      return res.status(404).json({ message: 'Published lesson not found', code: 'LESSON_NOT_FOUND' });
    }
    const completedIds = new Set((progress.verifiedCompletedLessons || []).map(String));
    if (earlierLessonIds.some((id) => !completedIds.has(String(id)))) {
      return res.status(409).json({
        message: 'Complete earlier lessons in this course first.',
        code: 'PREVIOUS_LESSONS_REQUIRED'
      });
    }

    const requiredQuizzes = await Quiz.find({ lesson: lesson._id, published: true }).select('_id').lean();
    const passedQuizIds = new Set(
      progress.quizAttempts
        .filter((attempt) => attempt.verified === true && attempt.passed === true && attempt.quiz)
        .map((attempt) => String(attempt.quiz))
    );
    const missingQuiz = requiredQuizzes.find((quiz) => !passedQuizIds.has(String(quiz._id)));
    if (missingQuiz) {
      return res.status(409).json({
        message: 'Pass the published lesson assessment before completing this lesson.',
        code: 'ASSESSMENT_REQUIRED',
        lessonId: String(lesson._id),
        quizId: String(missingQuiz._id)
      });
    }

    const alreadyCompleted = completedIds.has(String(lesson._id));
    progress.verifiedCompletedLessons.addToSet(lesson._id);
    progress.completedLessons.addToSet(lesson._id);
    progress.lastActive = new Date();
    await progress.save();

    if (!alreadyCompleted) {
      await ActivityEvent.create({
        user: req.user._id,
        type: 'lesson_complete',
        courseKey: lesson.course.slug,
        lesson: lesson._id,
        occurredAt: new Date()
      });
    }

    const result = await getOrCreateLearningAchievement(req.user._id);
    return res.json({
      completed: true,
      achievement: result.achievement
        ? {
            id: String(result.achievement._id),
            completedAt: result.achievement.completedAt,
            lessonCount: result.achievement.lessonCount,
            assessmentCount: result.achievement.assessmentCount
          }
        : null,
      achievementCreated: result.newlyCreated
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to complete lesson: ' + error.message });
  }
};

const recordEvent = async (req, res) => {
  try {
    const { type, courseKey, lessonId, score, total, percent } = req.body;
    if (!allowedTypes.has(type)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: { lastActive: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (lessonId) {
      const lesson = await Lesson.findById(lessonId).select('_id course');
      if (lesson) {
        if (type === 'quiz_attempt') {
          const normalizedPercent = Number.isFinite(Number(percent))
            ? Math.max(0, Math.min(100, Math.round(Number(percent))))
            : total
            ? Math.round((Number(score) || 0) / Math.max(1, Number(total)) * 100)
            : Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
          await Progress.updateOne(
            { user: req.user._id },
            {
              $push: {
                quizAttempts: {
                  lesson: lesson._id,
                  score: normalizedPercent,
                  passed: normalizedPercent >= 70,
                  verified: false,
                  attemptedAt: new Date(),
                },
              },
            }
          );
        }
      }
    }

    const normalizedScore = Number.isFinite(Number(score)) ? Number(score) : undefined;
    const normalizedTotal = Number.isFinite(Number(total)) ? Number(total) : undefined;
    const normalizedPercent = Number.isFinite(Number(percent))
      ? Math.max(0, Math.min(100, Math.round(Number(percent))))
      : normalizedTotal
      ? Math.max(0, Math.min(100, Math.round(((normalizedScore || 0) / Math.max(1, normalizedTotal)) * 100)))
      : undefined;

    const event = await ActivityEvent.create({
      user: req.user._id,
      type,
      courseKey: courseKey ? String(courseKey).trim() : undefined,
      lesson: lessonId && (await Lesson.exists({ _id: lessonId })) ? lessonId : undefined,
      score: normalizedScore,
      total: normalizedTotal,
      percent: normalizedPercent,
      occurredAt: new Date(),
    });

    return res.status(201).json({ event, progressId: progress._id });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to record activity: ' + error.message });
  }
};

module.exports = { getMyProgress, startLesson, completeLesson, recordEvent };

const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const ActivityEvent = require('../models/ActivityEvent');
const mongoose = require('mongoose');
const { getOrCreateLearningAchievement } = require('../services/learningAchievementService');
const { issueCourseCertificate } = require('../services/courseCertificateService');

const hideCorrectAnswers = (quiz) => ({
  ...quiz,
  questions: quiz.questions.map((question) => {
    const safeQuestion = { ...question };
    delete safeQuestion.correctAnswer;
    delete safeQuestion.explanation;
    return safeQuestion;
  })
});

const getPublicQuizzes = async (req, res) => {
  try {
    const filter = { published: true };
    if (req.query.lesson) filter.lesson = req.query.lesson;

    const quizzes = await Quiz.find(filter)
      .populate({ path: 'lesson', select: 'title course published', populate: { path: 'course', select: 'title slug published' } })
      .lean();

    const visible = quizzes.filter(
      (quiz) => quiz.lesson && quiz.lesson.published && quiz.lesson.course && quiz.lesson.course.published
    );

    return res.json({ quizzes: visible.map(hideCorrectAnswers) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load quizzes: ' + error.message });
  }
};

const getQuizForLesson = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId, published: true })
      .populate({ path: 'lesson', select: 'title course published', populate: { path: 'course', select: 'title slug published' } })
      .lean();
    if (!quiz || !quiz.lesson?.published || !quiz.lesson.course?.published) {
      return res.status(404).json({ message: 'Published quiz not found' });
    }
    return res.json({ quiz: hideCorrectAnswers(quiz) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load quiz: ' + error.message });
  }
};

const submitQuizAttempt = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.quizId)) {
      return res.status(404).json({ message: 'Quiz not found', code: 'QUIZ_NOT_FOUND' });
    }

    const quiz = await Quiz.findOne({ _id: req.params.quizId, published: true })
      .populate({
        path: 'lesson',
        select: 'published course',
        populate: { path: 'course', select: 'slug published' }
      })
      .lean();
    if (!quiz || !quiz.lesson?.published || !quiz.lesson.course?.published) {
      return res.status(404).json({ message: 'Published quiz not found', code: 'QUIZ_NOT_FOUND' });
    }
    if (!Array.isArray(quiz.questions) || !quiz.questions.length) {
      return res.status(400).json({ message: 'This quiz has no questions.', code: 'QUIZ_EMPTY' });
    }

    const answers = req.body?.answers;
    const validAnswers =
      Array.isArray(answers) &&
      answers.length === quiz.questions.length &&
      answers.every((answer, index) => {
        const optionCount =
          quiz.questions[index].options?.en?.length ||
          quiz.questions[index].options?.ar?.length ||
          0;
        return Number.isInteger(answer) && answer >= 0 && answer < optionCount;
      });
    if (!validAnswers) {
      return res.status(400).json({ message: 'Provide one valid answer for every question.', code: 'INVALID_ANSWERS' });
    }

    const correct = answers.reduce(
      (count, answer, index) =>
        count + (answer === quiz.questions[index].correctAnswer ? 1 : 0),
      0
    );
    const percent = Math.round((correct / quiz.questions.length) * 100);
    const passingScore = Number.isFinite(quiz.passingScore) ? quiz.passingScore : 70;
    const passed = percent >= passingScore;
    const attemptedAt = new Date();

    await Progress.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: { lastActive: attemptedAt },
        $push: {
          quizAttempts: {
            quiz: quiz._id,
            lesson: quiz.lesson._id,
            score: percent,
            passed,
            verified: true,
            attemptedAt
          }
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await ActivityEvent.create({
      user: req.user._id,
      type: 'quiz_attempt',
      courseKey: quiz.lesson.course.slug,
      lesson: quiz.lesson._id,
      score: percent,
      total: 100,
      percent,
      occurredAt: attemptedAt
    });

    let certificate = null;
    let certificateIssued = false;
    try {
      const certificateResult = await issueCourseCertificate(
        req.user._id,
        quiz.lesson.course.slug,
        req.user.name
      );
      certificate = certificateResult.certificate;
      certificateIssued = certificateResult.status === 'issued';
    } catch {
      certificateIssued = false;
    }

    const result = await getOrCreateLearningAchievement(req.user._id);
    return res.json({
      score: { correct, total: quiz.questions.length, percent, passed, passingScore },
      certificate,
      certificateIssued,
      achievement: result.achievement
        ? {
            record: {
              id: String(result.achievement._id),
              completedAt: result.achievement.completedAt,
              lessonCount: result.achievement.lessonCount,
              assessmentCount: result.achievement.assessmentCount
            },
            newlyCreated: result.newlyCreated,
            studentName: req.user.name
          }
        : null
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to submit quiz attempt: ' + error.message });
  }
};

module.exports = { getPublicQuizzes, getQuizForLesson, submitQuizAttempt };

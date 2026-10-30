const Progress = require('../models/Progress');
const ActivityEvent = require('../models/ActivityEvent');
const Lesson = require('../models/Lesson');

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
        if (type === 'lesson_complete' || type === 'course_complete') {
          await Progress.updateOne({ user: req.user._id }, { $addToSet: { completedLessons: lesson._id } });
        }
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

module.exports = { getMyProgress, recordEvent };

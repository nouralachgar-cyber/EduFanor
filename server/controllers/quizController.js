const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');

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

    return res.json({ quizzes: visible });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load quizzes: ' + error.message });
  }
};

const getQuizForLesson = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId, published: true })
      .populate({ path: 'lesson', select: 'title course published', populate: { path: 'course', select: 'title slug published' } })
      .lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    return res.json({ quiz });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load quiz: ' + error.message });
  }
};

module.exports = { getPublicQuizzes, getQuizForLesson };

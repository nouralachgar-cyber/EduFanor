const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    جلب جميع الدورات
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort('order');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم: ' + error.message });
  }
};

// @desc    جلب دورة معينة مع دروسها
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'الدورة غير موجودة' });
    }
    const lessons = await Lesson.find({ course: course._id }).sort('order');
    res.json({ course, lessons });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم: ' + error.message });
  }
};

module.exports = { getCourses, getCourseById };
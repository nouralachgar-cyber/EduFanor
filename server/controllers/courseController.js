const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    جلب جميع الدورات المنشورة مع دروسها
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const query = { published: true };
    const courses = await Course.find(query).sort('order').lean();
    const lessons = await Lesson.find({
      course: { $in: courses.map((course) => course._id) },
      published: true,
    })
      .sort('order')
      .lean();

    const lessonsByCourse = new Map();
    lessons.forEach((lesson) => {
      const key = String(lesson.course);
      if (!lessonsByCourse.has(key)) lessonsByCourse.set(key, []);
      lessonsByCourse.get(key).push(lesson);
    });

    res.json(
      courses.map((course) => ({
        ...course,
        lessons: lessonsByCourse.get(String(course._id)) || [],
        lessonCount: (lessonsByCourse.get(String(course._id)) || []).length,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم: ' + error.message });
  }
};

// @desc    جلب دورة معينة مع دروسها
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const filter = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id, published: true }
      : { slug: String(req.params.id).toLowerCase(), published: true };
    const course = await Course.findOne(filter).lean();
    if (!course) {
      return res.status(404).json({ message: 'الدورة غير موجودة' });
    }
    const lessons = await Lesson.find({ course: course._id, published: true }).sort('order').lean();
    res.json({ course: { ...course, lessonCount: lessons.length }, lessons });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم: ' + error.message });
  }
};

module.exports = { getCourses, getCourseById };

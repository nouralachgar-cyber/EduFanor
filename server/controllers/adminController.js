const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const ActivityEvent = require('../models/ActivityEvent');
const AdminAuditLog = require('../models/AdminAuditLog');

const PROGRESS_COLLECTION = Progress.collection.name;
const ACTIVITY_COLLECTION = ActivityEvent.collection.name;

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);
const monthKey = (date) => new Date(date).toISOString().slice(0, 7);

const parseRange = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 30;
  return Math.min(365, Math.max(7, Math.round(parsed)));
};

const rangeStart = (days) => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return start;
};

const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const bilingualRequired = (value) => value && String(value.ar || '').trim() && String(value.en || '').trim();

const audit = (actor, action, targetType, targetId, targetLabel, details) =>
  AdminAuditLog.create({
    actor: actor._id,
    action,
    targetType,
    targetId: targetId ? String(targetId) : undefined,
    targetLabel,
    details,
  });

const daySeries = (days) => {
  const start = rangeStart(days);
  const points = [];
  for (let index = 0; index < days; index += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    points.push({ date: dayKey(date), count: 0 });
  }
  return { start, points };
};

const monthSeries = (months = 12) => {
  const points = [];
  const now = new Date();
  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
    points.push({ date: monthKey(date), count: 0 });
  }
  return points;
};

const getActiveStudentIds = async (start) => {
  const [eventUsers, progressUsers, loginUsers] = await Promise.all([
    ActivityEvent.distinct('user', { occurredAt: { $gte: start } }),
    Progress.distinct('user', { lastActive: { $gte: start } }),
    User.distinct('_id', { role: 'student', lastLoginAt: { $gte: start } }),
  ]);
  return new Set([...eventUsers, ...progressUsers, ...loginUsers].map(String));
};

const overview = async (req, res) => {
  try {
    const range = parseRange(req.query.range);
    const start = rangeStart(range);
    const activeIds = await getActiveStudentIds(start);

    const [
      totalStudents,
      newStudents,
      publishedCourses,
      draftCourses,
      publishedLessons,
      draftLessons,
      quizAttemptCount,
      courseStartCount,
      courseCompleteCount,
      quizAverage,
      completedLessonCount,
      recentStudents,
      recentAudit,
      coursesWithoutLessons,
      awaitingReview,
      quizzesMissingQuestions,
      allLessons,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', createdAt: { $gte: start } }),
      Course.countDocuments({ published: true }),
      Course.countDocuments({ published: false }),
      Lesson.countDocuments({ published: true }),
      Lesson.countDocuments({ published: false }),
      ActivityEvent.countDocuments({ type: 'quiz_attempt', occurredAt: { $gte: start } }),
      ActivityEvent.countDocuments({ type: 'course_start', occurredAt: { $gte: start } }),
      ActivityEvent.countDocuments({ type: 'course_complete', occurredAt: { $gte: start } }),
      ActivityEvent.aggregate([
        { $match: { type: 'quiz_attempt', occurredAt: { $gte: start }, percent: { $ne: null } } },
        { $group: { _id: null, average: { $avg: '$percent' } } },
      ]),
      ActivityEvent.countDocuments({ type: 'lesson_complete', occurredAt: { $gte: start } }),
      User.find({ role: 'student' })
        .select('name email status createdAt lastLoginAt')
        .sort('-createdAt')
        .limit(5)
        .lean(),
      AdminAuditLog.find({})
        .sort('-createdAt')
        .limit(8)
        .populate('actor', 'name email role')
        .lean(),
      Course.aggregate([
        {
          $lookup: {
            from: Lesson.collection.name,
            localField: '_id',
            foreignField: 'course',
            as: 'lessons',
          },
        },
        { $match: { 'lessons.0': { $exists: false } } },
        { $project: { title: 1, slug: 1, published: 1 } },
        { $limit: 8 },
      ]),
      Lesson.countDocuments({ reviewStatus: { $ne: 'reviewed' } }),
      Quiz.countDocuments({ $or: [{ questions: { $size: 0 } }, { questions: { $exists: false } }] }),
      Lesson.countDocuments({}),
    ]);

    const registrationPoints = monthSeries(12);
    const studentRegistrations = await User.find({
      role: 'student',
      createdAt: { $gte: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 11, 1)) },
    })
      .select('createdAt')
      .lean();
    const registrationMap = new Map(registrationPoints.map((point) => [point.date, point]));
    studentRegistrations.forEach((student) => {
      const key = monthKey(student.createdAt);
      if (registrationMap.has(key)) registrationMap.get(key).count += 1;
    });

    const { points: activityPoints } = daySeries(range);
    const activityMap = new Map(activityPoints.map((point) => [point.date, point]));
    const events = await ActivityEvent.find({
      occurredAt: { $gte: start },
      type: { $in: ['course_start', 'course_complete', 'lesson_complete', 'quiz_attempt'] },
    })
      .select('type occurredAt')
      .lean();
    events.forEach((event) => {
      const point = activityMap.get(dayKey(event.occurredAt));
      if (!point) return;
      if (event.type === 'course_start') point.courseStarts = (point.courseStarts || 0) + 1;
      if (event.type === 'course_complete') point.courseCompletions = (point.courseCompletions || 0) + 1;
      if (event.type === 'lesson_complete') point.lessonCompletions = (point.lessonCompletions || 0) + 1;
      if (event.type === 'quiz_attempt') point.quizAttempts = (point.quizAttempts || 0) + 1;
    });

    const topCourseEvents = await ActivityEvent.aggregate([
      { $match: { occurredAt: { $gte: start }, courseKey: { $nin: [null, ''] } } },
      {
        $group: {
          _id: '$courseKey',
          starts: { $sum: { $cond: [{ $eq: ['$type', 'course_start'] }, 1, 0] } },
          completions: { $sum: { $cond: [{ $eq: ['$type', 'course_complete'] }, 1, 0] } },
          quizAttempts: { $sum: { $cond: [{ $eq: ['$type', 'quiz_attempt'] }, 1, 0] } },
        },
      },
      { $sort: { starts: -1, completions: -1 } },
      { $limit: 5 },
    ]);
    const courseSlugs = topCourseEvents.map((item) => item._id);
    const courseDocs = await Course.find({ slug: { $in: courseSlugs } }).select('slug title category').lean();
    const courseMap = new Map(courseDocs.map((course) => [course.slug, course]));
    const topCourses = topCourseEvents.map((item) => ({
      courseKey: item._id,
      starts: item.starts,
      completions: item.completions,
      quizAttempts: item.quizAttempts,
      title: courseMap.get(item._id)?.title || null,
    }));

    const studentsWithoutActivity = totalStudents - activeIds.size;

    return res.json({
      range,
      generatedAt: new Date().toISOString(),
      metrics: {
        totalStudents,
        activeStudents: activeIds.size,
        newStudents,
        publishedCourses,
        draftCourses,
        publishedLessons,
        draftLessons,
        totalLessons: allLessons,
        courseStarts: courseStartCount,
        courseCompletions: courseCompleteCount,
        lessonCompletions: completedLessonCount,
        quizAttempts: quizAttemptCount,
        averageQuizScore: quizAverage[0]?.average != null ? Math.round(quizAverage[0].average) : null,
        completionRate: courseStartCount > 0 ? Math.round((courseCompleteCount / courseStartCount) * 100) : null,
        studentsWithoutActivity,
      },
      registrations: registrationPoints,
      activity: activityPoints,
      topCourses,
      recentStudents,
      recentAudit,
      health: {
        coursesWithoutLessons,
        awaitingReview,
        quizzesMissingQuestions,
        unpublishedCourses: draftCourses,
        unpublishedLessons: draftLessons,
        studentsWithoutActivity,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load overview: ' + error.message });
  }
};

const listStudents = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 10));
    const search = String(req.query.search || '').trim();
    const status = ['active', 'suspended'].includes(req.query.status) ? req.query.status : null;
    const activity = ['active', 'inactive'].includes(req.query.activity) ? req.query.activity : null;
    const sort = String(req.query.sort || 'newest');
    const range = parseRange(req.query.range);
    const start = rangeStart(range);
    const activeIds = await getActiveStudentIds(start);

    const match = { role: 'student' };
    if (status) match.status = status;
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      match.$or = [{ name: pattern }, { email: pattern }];
    }
    if (activity === 'active') match._id = { $in: [...activeIds].map((id) => new mongoose.Types.ObjectId(id)) };
    if (activity === 'inactive') {
      const excluded = [...activeIds].map((id) => new mongoose.Types.ObjectId(id));
      if (excluded.length) match._id = { $nin: excluded };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { name: 1 },
      email: { email: 1 },
      activity: { lastActive: -1 },
    };
    const sortStage = sortMap[sort] || sortMap.newest;

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: PROGRESS_COLLECTION,
          localField: '_id',
          foreignField: 'user',
          as: 'progress',
        },
      },
      { $unwind: { path: '$progress', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: ACTIVITY_COLLECTION,
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
            {
              $group: {
                _id: null,
                coursesStarted: {
                  $addToSet: { $cond: [{ $eq: ['$type', 'course_start'] }, '$courseKey', '$$REMOVE'] },
                },
                coursesCompleted: {
                  $addToSet: { $cond: [{ $eq: ['$type', 'course_complete'] }, '$courseKey', '$$REMOVE'] },
                },
                quizAttempts: { $sum: { $cond: [{ $eq: ['$type', 'quiz_attempt'] }, 1, 0] } },
                lastEventAt: { $max: '$occurredAt' },
              },
            },
          ],
          as: 'activityStats',
        },
      },
      { $unwind: { path: '$activityStats', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          completedLessonCount: { $size: { $ifNull: ['$progress.completedLessons', []] } },
          quizAttemptCount: { $size: { $ifNull: ['$progress.quizAttempts', []] } },
          bestQuiz: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ['$progress.quizAttempts', []] } }, 0] },
              { $max: '$progress.quizAttempts.score' },
              null,
            ],
          },
          lastActive: {
            $ifNull: [
              '$activityStats.lastEventAt',
              { $ifNull: ['$progress.lastActive', '$lastLoginAt'] },
            ],
          },
          coursesStarted: { $size: { $ifNull: ['$activityStats.coursesStarted', []] } },
          coursesCompleted: { $size: { $ifNull: ['$activityStats.coursesCompleted', []] } },
          activityCount: { $add: [{ $ifNull: ['$activityStats.quizAttempts', 0] }, { $size: { $ifNull: ['$progress.completedLessons', []] } }] },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          status: 1,
          createdAt: 1,
          lastLoginAt: 1,
          lastActive: 1,
          completedLessonCount: 1,
          quizAttemptCount: 1,
          bestQuiz: 1,
          coursesStarted: 1,
          coursesCompleted: 1,
          activityCount: 1,
        },
      },
      { $sort: sortStage },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const [students, totalResult] = await Promise.all([
      User.aggregate(pipeline),
      User.countDocuments(match),
    ]);

    return res.json({
      students: students.map((student) => ({ ...student, active: activeIds.has(String(student._id)) })),
      pagination: { page, limit, total: totalResult, pages: Math.max(1, Math.ceil(totalResult / limit)) },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load students: ' + error.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const [progress, events, courseKeys] = await Promise.all([
      Progress.findOne({ user: user._id })
        .populate({ path: 'completedLessons', select: 'title order course', populate: { path: 'course', select: 'title slug' } })
        .populate({ path: 'quizAttempts.lesson', select: 'title course', populate: { path: 'course', select: 'title slug' } })
        .lean(),
      ActivityEvent.find({ user: user._id })
        .sort('-occurredAt')
        .limit(40)
        .populate({ path: 'lesson', select: 'title course', populate: { path: 'course', select: 'title slug' } })
        .lean(),
      ActivityEvent.distinct('courseKey', { user: user._id, courseKey: { $nin: [null, ''] } }),
    ]);

    const courses = await Course.find({ slug: { $in: courseKeys } })
      .select('slug title category estimatedMinutes published')
      .lean();

    return res.json({
      student: user,
      progress: progress || null,
      events,
      courses,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load student: ' + error.message });
  }
};

const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid account status' });
    }

    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.status = status;
    await student.save();

    await audit(
      req.user,
      status === 'suspended' ? 'student.suspend' : 'student.activate',
      'student',
      student._id,
      student.email,
      `Account status changed to ${status}.`
    );

    return res.json({ student: { _id: student._id, name: student.name, email: student.email, status: student.status } });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update student: ' + error.message });
  }
};

const listCourses = async (req, res) => {
  try {
    const search = String(req.query.search || '').trim();
    const status = ['published', 'draft'].includes(req.query.status) ? req.query.status : null;
    const match = {};
    if (status) match.published = status === 'published';
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      match.$or = [{ 'title.ar': pattern }, { 'title.en': pattern }, { slug: pattern }];
    }

    const courses = await Course.aggregate([
      { $match: match },
      {
        $lookup: {
          from: Lesson.collection.name,
          localField: '_id',
          foreignField: 'course',
          as: 'lessons',
        },
      },
      {
        $lookup: {
          from: Quiz.collection.name,
          localField: 'lessons._id',
          foreignField: 'lesson',
          as: 'quizzes',
        },
      },
      {
        $addFields: {
          lessonCount: { $size: '$lessons' },
          publishedLessonCount: {
            $size: { $filter: { input: '$lessons', as: 'lesson', cond: '$$lesson.published' } },
          },
          quizCount: { $size: '$quizzes' },
          questionCount: {
            $sum: {
              $map: {
                input: '$quizzes',
                as: 'quiz',
                in: { $size: { $ifNull: ['$$quiz.questions', []] } },
              },
            },
          },
        },
      },
      { $project: { lessons: 0, quizzes: 0 } },
      { $sort: { order: 1, createdAt: -1 } },
    ]);

    return res.json({ courses });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load courses: ' + error.message });
  }
};

const coursePayload = (body) => ({
  slug: String(body.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
  title: { ar: String(body.title?.ar || '').trim(), en: String(body.title?.en || '').trim() },
  description: { ar: String(body.description?.ar || '').trim(), en: String(body.description?.en || '').trim() },
  category: body.category,
  difficulty: body.difficulty,
  image: String(body.image || '').trim(),
  estimatedMinutes: Number(body.estimatedMinutes) || 15,
  order: Number(body.order) || 0,
  published: Boolean(body.published),
});

const createCourse = async (req, res) => {
  try {
    const payload = coursePayload(req.body);
    if (!payload.slug || !bilingualRequired(payload.title) || !bilingualRequired(payload.description)) {
      return res.status(400).json({ message: 'Slug, Arabic/English titles and descriptions are required' });
    }
    if (!['cpr', 'bleeding', 'choking', 'burns', 'general'].includes(payload.category)) {
      return res.status(400).json({ message: 'Invalid course category' });
    }
    if (!['beginner', 'intermediate', 'advanced'].includes(payload.difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }
    if (!payload.image) {
      return res.status(400).json({ message: 'An image URL is required' });
    }

    const existing = await Course.findOne({ slug: payload.slug });
    if (existing) return res.status(400).json({ message: 'A course with this slug already exists' });

    const course = await Course.create(payload);
    await audit(req.user, 'course.create', 'course', course._id, course.title.en, `Created course ${course.slug}.`);
    return res.status(201).json({ course });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create course: ' + error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessons = await Lesson.find({ course: course._id }).sort('order').lean();
    const quizzes = await Quiz.find({ lesson: { $in: lessons.map((lesson) => lesson._id) } })
      .populate('lesson', 'title order')
      .sort('createdAt')
      .lean();

    return res.json({ course, lessons, quizzes });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load course: ' + error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const payload = coursePayload(req.body);
    if (!payload.slug || !bilingualRequired(payload.title) || !bilingualRequired(payload.description)) {
      return res.status(400).json({ message: 'Slug, Arabic/English titles and descriptions are required' });
    }
    if (!['cpr', 'bleeding', 'choking', 'burns', 'general'].includes(payload.category)) {
      return res.status(400).json({ message: 'Invalid course category' });
    }
    if (!['beginner', 'intermediate', 'advanced'].includes(payload.difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }
    if (!payload.image) {
      return res.status(400).json({ message: 'An image URL is required' });
    }

    const duplicate = await Course.findOne({ slug: payload.slug, _id: { $ne: course._id } });
    if (duplicate) return res.status(400).json({ message: 'A course with this slug already exists' });

    Object.assign(course, payload);
    await course.save();

    await audit(
      req.user,
      'course.update',
      'course',
      course._id,
      course.title.en,
      `Updated course ${course.slug}${payload.published ? ' and published it' : ' (draft/unpublished)'}.`
    );

    return res.json({ course });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update course: ' + error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessons = await Lesson.find({ course: course._id }).select('_id').lean();
    const lessonIds = lessons.map((lesson) => lesson._id);

    await Promise.all([
      Quiz.deleteMany({ lesson: { $in: lessonIds } }),
      Lesson.deleteMany({ course: course._id }),
      Progress.updateMany({}, { $pull: { completedLessons: { $in: lessonIds } } }),
      ActivityEvent.deleteMany({ $or: [{ courseKey: course.slug }, { lesson: { $in: lessonIds } }] }),
    ]);
    await course.deleteOne();

    await audit(req.user, 'course.delete', 'course', course._id, course.title.en, `Deleted course ${course.slug} and its lessons/quizzes.`);
    return res.json({ message: 'Course deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete course: ' + error.message });
  }
};

const listLessons = async (req, res) => {
  try {
    const match = {};
    if (req.query.course && mongoose.isValidObjectId(req.query.course)) match.course = req.query.course;
    if (['published', 'draft'].includes(req.query.status)) match.published = req.query.status === 'published';
    if (['unreviewed', 'in_review', 'reviewed'].includes(req.query.reviewStatus)) match.reviewStatus = req.query.reviewStatus;
    if (String(req.query.search || '').trim()) {
      const pattern = new RegExp(escapeRegex(req.query.search), 'i');
      match.$or = [{ 'title.ar': pattern }, { 'title.en': pattern }];
    }

    const lessons = await Lesson.find(match)
      .populate('course', 'title slug category')
      .sort('course order')
      .lean();

    return res.json({ lessons });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load lessons: ' + error.message });
  }
};

const lessonPayload = (body) => ({
  course: body.course,
  title: { ar: String(body.title?.ar || '').trim(), en: String(body.title?.en || '').trim() },
  content: { ar: String(body.content?.ar || '').trim(), en: String(body.content?.en || '').trim() },
  objectives: {
    ar: Array.isArray(body.objectives?.ar) ? body.objectives.ar.map(String).filter(Boolean) : [],
    en: Array.isArray(body.objectives?.en) ? body.objectives.en.map(String).filter(Boolean) : [],
  },
  safetyNotes: {
    ar: String(body.safetyNotes?.ar || '').trim(),
    en: String(body.safetyNotes?.en || '').trim(),
  },
  images: Array.isArray(body.images) ? body.images.map(String).filter(Boolean) : [],
  videoUrl: String(body.videoUrl || '').trim(),
  sourceRefs: Array.isArray(body.sourceRefs) ? body.sourceRefs.map(String).filter(Boolean) : [],
  reviewStatus: ['unreviewed', 'in_review', 'reviewed'].includes(body.reviewStatus) ? body.reviewStatus : 'unreviewed',
  published: Boolean(body.published),
  order: Number(body.order) || 0,
});

const createLesson = async (req, res) => {
  try {
    const payload = lessonPayload(req.body);
    if (!mongoose.isValidObjectId(payload.course)) return res.status(400).json({ message: 'A valid course is required' });
    if (!bilingualRequired(payload.title) || !bilingualRequired(payload.content)) {
      return res.status(400).json({ message: 'Arabic/English lesson titles and content are required' });
    }
    const course = await Course.findById(payload.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lesson = await Lesson.create(payload);
    await audit(req.user, 'lesson.create', 'lesson', lesson._id, lesson.title.en, `Created lesson in ${course.slug}.`);
    return res.status(201).json({ lesson: await lesson.populate('course', 'title slug category') });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create lesson: ' + error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course', 'title slug category').lean();
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const quizzes = await Quiz.find({ lesson: lesson._id }).sort('createdAt').lean();
    return res.json({ lesson, quizzes });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load lesson: ' + error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const payload = lessonPayload(req.body);
    if (!mongoose.isValidObjectId(payload.course)) return res.status(400).json({ message: 'A valid course is required' });
    if (!bilingualRequired(payload.title) || !bilingualRequired(payload.content)) {
      return res.status(400).json({ message: 'Arabic/English lesson titles and content are required' });
    }
    const course = await Course.findById(payload.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    Object.assign(lesson, payload);
    await lesson.save();
    await audit(req.user, 'lesson.update', 'lesson', lesson._id, lesson.title.en, `Updated lesson in ${course.slug}.`);

    return res.json({ lesson: await lesson.populate('course', 'title slug category') });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update lesson: ' + error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    await Promise.all([
      Quiz.deleteMany({ lesson: lesson._id }),
      Progress.updateMany({}, { $pull: { completedLessons: lesson._id } }),
      ActivityEvent.deleteMany({ lesson: lesson._id }),
    ]);
    await lesson.deleteOne();
    await audit(req.user, 'lesson.delete', 'lesson', lesson._id, lesson.title.en, 'Deleted lesson and its quizzes.');
    return res.json({ message: 'Lesson deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete lesson: ' + error.message });
  }
};

const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) return null;
  const normalized = [];
  for (const [index, question] of questions.entries()) {
    const ar = String(question?.question?.ar || '').trim();
    const en = String(question?.question?.en || '').trim();
    const optionsAr = Array.isArray(question?.options?.ar) ? question.options.ar.map(String).map((item) => item.trim()).filter(Boolean) : [];
    const optionsEn = Array.isArray(question?.options?.en) ? question.options.en.map(String).map((item) => item.trim()).filter(Boolean) : [];
    const correctAnswer = Number(question?.correctAnswer);
    if (!ar || !en) return { error: `Question ${index + 1}: Arabic and English text are required` };
    if (optionsAr.length < 2 || optionsEn.length < 2 || optionsAr.length !== optionsEn.length) {
      return { error: `Question ${index + 1}: Provide the same number (at least 2) of Arabic and English options` };
    }
    if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer >= optionsAr.length) {
      return { error: `Question ${index + 1}: Choose a valid correct answer` };
    }
    normalized.push({
      question: { ar, en },
      options: { ar: optionsAr, en: optionsEn },
      correctAnswer,
      explanation: {
        ar: String(question?.explanation?.ar || '').trim(),
        en: String(question?.explanation?.en || '').trim(),
      },
    });
  }
  return { questions: normalized };
};

const quizPayload = (body) => ({
  title: { ar: String(body.title?.ar || '').trim(), en: String(body.title?.en || '').trim() },
  lesson: body.lesson,
  passingScore: Math.min(100, Math.max(0, Number(body.passingScore) || 70)),
  published: Boolean(body.published),
});

const listQuizzes = async (req, res) => {
  try {
    const match = {};
    if (req.query.lesson && mongoose.isValidObjectId(req.query.lesson)) match.lesson = req.query.lesson;
    if (String(req.query.search || '').trim()) {
      const pattern = new RegExp(escapeRegex(req.query.search), 'i');
      match.$or = [{ 'title.ar': pattern }, { 'title.en': pattern }];
    }

    const quizzes = await Quiz.find(match)
      .populate({ path: 'lesson', select: 'title order course', populate: { path: 'course', select: 'title slug' } })
      .sort('-createdAt')
      .lean();

    const lessonIds = quizzes.map((quiz) => quiz.lesson?._id).filter(Boolean);
    const progressDocs = await Progress.find({ 'quizAttempts.lesson': { $in: lessonIds } })
      .select('quizAttempts')
      .lean();

    const results = quizzes.map((quiz) => {
      const attempts = progressDocs.flatMap((progress) =>
        (progress.quizAttempts || []).filter(
          (attempt) => attempt.lesson && String(attempt.lesson) === String(quiz.lesson?._id)
        )
      );
      const average = attempts.length
        ? Math.round(attempts.reduce((sum, attempt) => sum + (Number(attempt.score) || 0), 0) / attempts.length)
        : null;
      return {
        ...quiz,
        attemptCount: attempts.length,
        averageScore: average,
      };
    });

    return res.json({ quizzes: results });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load quizzes: ' + error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const payload = quizPayload(req.body);
    const normalized = normalizeQuestions(req.body.questions);
    if (!bilingualRequired(payload.title)) return res.status(400).json({ message: 'Arabic/English quiz titles are required' });
    if (!mongoose.isValidObjectId(payload.lesson)) return res.status(400).json({ message: 'A valid lesson is required' });
    if (normalized?.error) return res.status(400).json({ message: normalized.error });
    if (!normalized?.questions) return res.status(400).json({ message: 'Add at least one question' });

    const lesson = await Lesson.findById(payload.lesson);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const quiz = await Quiz.create({ ...payload, questions: normalized.questions });
    await audit(req.user, 'quiz.create', 'quiz', quiz._id, quiz.title.en, `Created quiz for lesson ${lesson.title.en}.`);
    return res.status(201).json({ quiz });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create quiz: ' + error.message });
  }
};

const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate({ path: 'lesson', select: 'title order course', populate: { path: 'course', select: 'title slug' } })
      .lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    return res.json({ quiz });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load quiz: ' + error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const payload = quizPayload(req.body);
    const normalized = normalizeQuestions(req.body.questions);
    if (!bilingualRequired(payload.title)) return res.status(400).json({ message: 'Arabic/English quiz titles are required' });
    if (!mongoose.isValidObjectId(payload.lesson)) return res.status(400).json({ message: 'A valid lesson is required' });
    if (normalized?.error) return res.status(400).json({ message: normalized.error });
    if (!normalized?.questions) return res.status(400).json({ message: 'Add at least one question' });

    const lesson = await Lesson.findById(payload.lesson);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    Object.assign(quiz, payload, { questions: normalized.questions });
    await quiz.save();
    await audit(req.user, 'quiz.update', 'quiz', quiz._id, quiz.title.en, `Updated quiz for lesson ${lesson.title.en}.`);
    return res.json({ quiz });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update quiz: ' + error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await quiz.deleteOne();
    await audit(req.user, 'quiz.delete', 'quiz', quiz._id, quiz.title.en, 'Deleted quiz.');
    return res.json({ message: 'Quiz deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete quiz: ' + error.message });
  }
};

const analytics = async (req, res) => {
  try {
    const range = parseRange(req.query.range);
    const start = rangeStart(range);
    const courseKey = String(req.query.course || '').trim() || null;
    const eventMatch = { occurredAt: { $gte: start } };
    if (courseKey) eventMatch.courseKey = courseKey;

    const { points: activityPoints } = daySeries(range);
    const activityMap = new Map(activityPoints.map((point) => [point.date, point]));
    const events = await ActivityEvent.find(eventMatch)
      .select('type occurredAt percent score lesson courseKey')
      .lean();
    events.forEach((event) => {
      const point = activityMap.get(dayKey(event.occurredAt));
      if (!point) return;
      if (event.type === 'course_start') point.courseStarts = (point.courseStarts || 0) + 1;
      if (event.type === 'course_complete') point.courseCompletions = (point.courseCompletions || 0) + 1;
      if (event.type === 'lesson_complete') point.lessonCompletions = (point.lessonCompletions || 0) + 1;
      if (event.type === 'quiz_attempt') point.quizAttempts = (point.quizAttempts || 0) + 1;
    });

    const registrationMap = new Map(activityPoints.map((point) => [point.date, 0]));
    const students = await User.find({ role: 'student', createdAt: { $gte: start } }).select('createdAt').lean();
    students.forEach((student) => {
      const key = dayKey(student.createdAt);
      if (registrationMap.has(key)) registrationMap.set(key, registrationMap.get(key) + 1);
    });
    const registrations = activityPoints.map((point) => ({ date: point.date, count: registrationMap.get(point.date) }));

    const topCoursesRaw = await ActivityEvent.aggregate([
      { $match: { ...eventMatch, courseKey: { $nin: [null, ''] } } },
      {
        $group: {
          _id: '$courseKey',
          starts: { $sum: { $cond: [{ $eq: ['$type', 'course_start'] }, 1, 0] } },
          completions: { $sum: { $cond: [{ $eq: ['$type', 'course_complete'] }, 1, 0] } },
          quizAttempts: { $sum: { $cond: [{ $eq: ['$type', 'quiz_attempt'] }, 1, 0] } },
        },
      },
      { $sort: { starts: -1, completions: -1 } },
      { $limit: 10 },
    ]);
    const courseDocs = await Course.find({ slug: { $in: topCoursesRaw.map((item) => item._id) } })
      .select('slug title category')
      .lean();
    const courseMap = new Map(courseDocs.map((course) => [course.slug, course]));
    const topCourses = topCoursesRaw.map((item) => ({
      courseKey: item._id,
      title: courseMap.get(item._id)?.title || null,
      category: courseMap.get(item._id)?.category || null,
      starts: item.starts,
      completions: item.completions,
      quizAttempts: item.quizAttempts,
      completionRate: item.starts ? Math.round((item.completions / item.starts) * 100) : null,
    }));

    const topLessonsRaw = await ActivityEvent.aggregate([
      { $match: { ...eventMatch, type: 'lesson_complete', lesson: { $ne: null } } },
      { $group: { _id: '$lesson', completions: { $sum: 1 } } },
      { $sort: { completions: -1 } },
      { $limit: 8 },
    ]);
    const lessonDocs = await Lesson.find({ _id: { $in: topLessonsRaw.map((item) => item._id) } })
      .select('title course')
      .populate('course', 'title slug')
      .lean();
    const lessonMap = new Map(lessonDocs.map((lesson) => [String(lesson._id), lesson]));
    const topLessons = topLessonsRaw.map((item) => ({
      lessonId: item._id,
      title: lessonMap.get(String(item._id))?.title || null,
      course: lessonMap.get(String(item._id))?.course || null,
      completions: item.completions,
    }));

    const quizScores = events.filter((event) => event.type === 'quiz_attempt' && event.percent != null).map((event) => event.percent);
    const distribution = [
      { label: '0-20', min: 0, max: 20, count: 0 },
      { label: '21-40', min: 21, max: 40, count: 0 },
      { label: '41-60', min: 41, max: 60, count: 0 },
      { label: '61-80', min: 61, max: 80, count: 0 },
      { label: '81-100', min: 81, max: 100, count: 0 },
    ];
    quizScores.forEach((score) => {
      const bucket = distribution.find((item) => score >= item.min && score <= item.max);
      if (bucket) bucket.count += 1;
    });

    const activeStudents = await getActiveStudentIds(start);

    return res.json({
      range,
      course: courseKey,
      generatedAt: new Date().toISOString(),
      summary: {
        registrations: students.length,
        activeStudents: activeStudents.size,
        courseStarts: events.filter((event) => event.type === 'course_start').length,
        courseCompletions: events.filter((event) => event.type === 'course_complete').length,
        lessonCompletions: events.filter((event) => event.type === 'lesson_complete').length,
        quizAttempts: events.filter((event) => event.type === 'quiz_attempt').length,
        averageQuizScore: quizScores.length ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length) : null,
      },
      registrations,
      activity: activityPoints,
      topCourses,
      topLessons,
      quizDistribution: distribution,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load analytics: ' + error.message });
  }
};

const activityFeed = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 20));
    const match = {};
    if (['course_start', 'course_complete', 'quiz_attempt', 'lesson_complete'].includes(req.query.type)) {
      match.type = req.query.type;
    }

    const [events, total] = await Promise.all([
      ActivityEvent.find(match)
        .sort('-occurredAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name email')
        .populate({ path: 'lesson', select: 'title course', populate: { path: 'course', select: 'title slug' } })
        .lean(),
      ActivityEvent.countDocuments(match),
    ]);

    return res.json({
      events,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load activity: ' + error.message });
  }
};

const auditFeed = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 20));
    const [logs, total] = await Promise.all([
      AdminAuditLog.find({})
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('actor', 'name email role')
        .lean(),
      AdminAuditLog.countDocuments({}),
    ]);
    return res.json({
      logs,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load audit log: ' + error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const [auditLogs, actionCount] = await Promise.all([
      AdminAuditLog.find({ actor: req.user._id }).sort('-createdAt').limit(10).lean(),
      AdminAuditLog.countDocuments({ actor: req.user._id }),
    ]);
    return res.json({ user: req.user, recentActions: auditLogs, actionCount });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load profile: ' + error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) return res.status(400).json({ message: 'This email is already in use' });

    const admin = await User.findById(req.user._id);
    admin.name = name;
    admin.email = email;
    await admin.save();

    await audit(admin, 'admin.profile_update', 'admin', admin._id, admin.email, 'Updated administrator profile.');
    return res.json({ user: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, status: admin.status, createdAt: admin.createdAt, lastLoginAt: admin.lastLoginAt } });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update profile: ' + error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required' });
    if (String(newPassword).length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });

    const admin = await User.findById(req.user._id);
    if (!(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    await audit(admin, 'admin.password_change', 'admin', admin._id, admin.email, 'Changed administrator password.');
    return res.json({ message: 'Password updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update password: ' + error.message });
  }
};

module.exports = {
  overview,
  listStudents,
  getStudent,
  updateStudentStatus,
  listCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  listLessons,
  createLesson,
  getLesson,
  updateLesson,
  deleteLesson,
  listQuizzes,
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  analytics,
  activityFeed,
  auditFeed,
  getProfile,
  updateProfile,
  updatePassword,
};

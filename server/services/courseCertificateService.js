const crypto = require('crypto');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const CourseCertificate = require('../models/CourseCertificate');
const evaluateAchievementEligibility = require('./achievementEligibility');

function buildCertificateId(completedAt = new Date()) {
  const year = new Date(completedAt).getUTCFullYear();
  return `EDU-${year}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

function serializeCertificate(certificate) {
  if (!certificate) return null;
  return {
    id: String(certificate._id),
    userId: String(certificate.user),
    courseId: String(certificate.course),
    courseKey: certificate.courseKey,
    certificateId: certificate.certificateId,
    studentName: certificate.studentName,
    courseTitle: certificate.courseTitle,
    instructor: certificate.instructor || null,
    completedAt: certificate.completedAt,
    issuedAt: certificate.issuedAt
  };
}

function normalizeIdentifier(identifier) {
  return String(identifier || '').trim().toLowerCase();
}

async function findPublishedCourse(identifier) {
  const key = normalizeIdentifier(identifier);
  if (!key) return null;
  const conditions = mongoose.isValidObjectId(key)
    ? { $or: [{ _id: key }, { slug: key }] }
    : { slug: key };
  return Course.findOne({ published: true, ...conditions }).lean();
}

function getEnglishTitle(title, fallback) {
  if (typeof title === 'string' && title.trim()) return title.trim();
  if (title && typeof title.en === 'string' && title.en.trim()) return title.en.trim();
  return fallback;
}

async function collectCourseEvidence(courseId, userId) {
  const lessons = await Lesson.find({ course: courseId, published: true })
    .select('_id')
    .lean();
  const lessonIds = lessons.map((lesson) => lesson._id);
  const quizzes = await Quiz.find({ lesson: { $in: lessonIds }, published: true })
    .select('_id')
    .lean();
  const progressRecords = await Progress.find({ user: userId })
    .select('verifiedCompletedLessons quizAttempts')
    .lean();

  const completedLessonIds = [];
  const verifiedPassedQuizIds = [];
  progressRecords.forEach((record) => {
    (record.verifiedCompletedLessons || []).forEach((id) => {
      if (id) completedLessonIds.push(id);
    });
    (record.quizAttempts || []).forEach((attempt) => {
      if (attempt?.quiz && attempt.verified === true && attempt.passed === true) {
        verifiedPassedQuizIds.push(attempt.quiz);
      }
    });
  });

  return {
    evaluation: evaluateAchievementEligibility({
      requiredLessonIds: lessonIds,
      requiredQuizIds: quizzes.map((quiz) => quiz._id),
      verifiedCompletedLessonIds: completedLessonIds,
      verifiedPassedQuizIds
    })
  };
}

async function getCourseCertificateStatus(userId, identifier, studentName) {
  const key = normalizeIdentifier(identifier);
  const course = await findPublishedCourse(key);
  let existing = null;

  if (course) {
    existing = await CourseCertificate.findOne({ user: userId, course: course._id }).lean();
  }
  if (!existing && key) {
    existing = await CourseCertificate.findOne({ user: userId, courseKey: key }).lean();
  }

  if (existing) {
    return {
      course: {
        key: existing.courseKey,
        title: existing.courseTitle
      },
      eligible: true,
      newlyIssued: false,
      certificate: serializeCertificate(existing),
      progress: null
    };
  }

  if (!course) {
    return {
      course: null,
      eligible: false,
      newlyIssued: false,
      certificate: null,
      progress: null
    };
  }

  const { evaluation } = await collectCourseEvidence(course._id, userId);
  return {
    course: {
      key: course.slug,
      title: getEnglishTitle(course.title, course.slug)
    },
    eligible: evaluation.eligible,
    newlyIssued: false,
    certificate: null,
    progress: {
      lessonCount: evaluation.lessonCount,
      completedLessonCount: evaluation.completedLessonCount,
      assessmentCount: evaluation.assessmentCount,
      passedAssessmentCount: evaluation.passedAssessmentCount
    }
  };
}

async function issueCourseCertificate(userId, identifier, studentName) {
  const course = await findPublishedCourse(identifier);
  if (!course) return { status: 'course_not_found', certificate: null };

  const existing = await CourseCertificate.findOne({ user: userId, course: course._id }).lean();
  if (existing) return { status: 'existing', certificate: serializeCertificate(existing) };

  const { evaluation } = await collectCourseEvidence(course._id, userId);
  if (!evaluation.eligible) return { status: 'not_eligible', certificate: null };

  const completedAt = new Date();
  const payload = {
    user: userId,
    course: course._id,
    courseKey: course.slug,
    certificateId: buildCertificateId(completedAt),
    studentName: String(studentName || 'Learner').trim() || 'Learner',
    courseTitle: getEnglishTitle(course.title, course.slug),
    instructor: course.instructor ? String(course.instructor).trim() : null,
    completedAt,
    issuedAt: new Date()
  };

  let certificate = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    payload.certificateId = buildCertificateId(completedAt);
    try {
      certificate = await CourseCertificate.findOneAndUpdate(
        { user: userId, course: course._id },
        { $setOnInsert: payload },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      break;
    } catch (error) {
      if (error?.code !== 11000) throw error;
      certificate = await CourseCertificate.findOne({ user: userId, course: course._id }).lean();
      if (certificate) break;
    }
  }

  return {
    status: certificate ? 'issued' : 'not_eligible',
    certificate: serializeCertificate(certificate)
  };
}

module.exports = {
  buildCertificateId,
  serializeCertificate,
  getCourseCertificateStatus,
  issueCourseCertificate
};

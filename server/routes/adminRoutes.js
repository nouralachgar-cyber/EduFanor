const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const admin = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/overview', admin.overview);

router.get('/students', admin.listStudents);
router.get('/students/:id', admin.getStudent);
router.patch('/students/:id/status', admin.updateStudentStatus);

router.get('/courses', admin.listCourses);
router.post('/courses', admin.createCourse);
router.get('/courses/:id', admin.getCourse);
router.patch('/courses/:id', admin.updateCourse);
router.delete('/courses/:id', admin.deleteCourse);

router.get('/lessons', admin.listLessons);
router.post('/lessons', admin.createLesson);
router.get('/lessons/:id', admin.getLesson);
router.patch('/lessons/:id', admin.updateLesson);
router.delete('/lessons/:id', admin.deleteLesson);

router.get('/quizzes', admin.listQuizzes);
router.post('/quizzes', admin.createQuiz);
router.get('/quizzes/:id', admin.getQuiz);
router.patch('/quizzes/:id', admin.updateQuiz);
router.delete('/quizzes/:id', admin.deleteQuiz);

router.get('/analytics', admin.analytics);
router.get('/activity', admin.activityFeed);
router.get('/audit', admin.auditFeed);

router.get('/profile', admin.getProfile);
router.patch('/profile', admin.updateProfile);
router.patch('/password', admin.updatePassword);

module.exports = router;

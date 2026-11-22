const express = require('express');
const router = express.Router();
const { protect, studentOnly } = require('../middleware/authMiddleware');
const { getPublicQuizzes, getQuizForLesson, submitQuizAttempt } = require('../controllers/quizController');

router.get('/', getPublicQuizzes);
router.get('/lesson/:lessonId', getQuizForLesson);
router.post('/:quizId/attempt', protect, studentOnly, submitQuizAttempt);

module.exports = router;

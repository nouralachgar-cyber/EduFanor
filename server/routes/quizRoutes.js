const express = require('express');
const router = express.Router();
const { getPublicQuizzes, getQuizForLesson } = require('../controllers/quizController');

router.get('/', getPublicQuizzes);
router.get('/lesson/:lessonId', getQuizForLesson);

module.exports = router;

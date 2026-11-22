const express = require('express');
const router = express.Router();
const { protect, studentOnly } = require('../middleware/authMiddleware');
const { getMyProgress, startLesson, completeLesson, recordEvent } = require('../controllers/progressController');

router.get('/me', protect, getMyProgress);
router.post('/event', protect, recordEvent);
router.post('/lessons/:lessonId/start', protect, studentOnly, startLesson);
router.post('/lessons/:lessonId/complete', protect, studentOnly, completeLesson);

module.exports = router;

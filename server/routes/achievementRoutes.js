const express = require('express');
const router = express.Router();
const { protect, studentOnly } = require('../middleware/authMiddleware');
const { getMyAchievement } = require('../controllers/achievementController');

router.get('/me', protect, studentOnly, getMyAchievement);

module.exports = router;

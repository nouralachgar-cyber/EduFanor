const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyProgress, recordEvent } = require('../controllers/progressController');

router.get('/me', protect, getMyProgress);
router.post('/event', protect, recordEvent);

module.exports = router;

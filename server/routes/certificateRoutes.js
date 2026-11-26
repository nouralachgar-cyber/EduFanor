const express = require('express');
const router = express.Router();
const { protect, studentOnly } = require('../middleware/authMiddleware');
const { listMyCertificates, getCertificateForCourse } = require('../controllers/certificateController');

router.get('/', protect, studentOnly, listMyCertificates);
router.get('/:courseKey', protect, studentOnly, getCertificateForCourse);

module.exports = router;

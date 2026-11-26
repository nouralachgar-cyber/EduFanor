const CourseCertificate = require('../models/CourseCertificate');
const {
  getCourseCertificateStatus,
  issueCourseCertificate,
  serializeCertificate
} = require('../services/courseCertificateService');

const listMyCertificates = async (req, res) => {
  try {
    const certificates = await CourseCertificate.find({ user: req.user._id })
      .sort({ issuedAt: -1 })
      .lean();
    return res.json({ certificates: certificates.map(serializeCertificate) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load certificates: ' + error.message });
  }
};

const getCertificateForCourse = async (req, res) => {
  try {
    const status = await getCourseCertificateStatus(
      req.user._id,
      req.params.courseKey,
      req.user.name
    );

    if (!status.course && !status.certificate) {
      return res.status(404).json({
        message: 'Published course not found',
        code: 'COURSE_NOT_FOUND'
      });
    }

    if (status.eligible && !status.certificate) {
      const issued = await issueCourseCertificate(
        req.user._id,
        req.params.courseKey,
        req.user.name
      );
      if (issued.certificate) {
        return res.json({
          ...status,
          certificate: issued.certificate,
          newlyIssued: issued.status === 'issued'
        });
      }
    }

    return res.json(status);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load certificate: ' + error.message });
  }
};

module.exports = { listMyCertificates, getCertificateForCourse };

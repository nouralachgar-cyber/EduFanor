const mongoose = require('mongoose');

const courseCertificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseKey: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  courseTitle: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: String,
    default: null,
    trim: true
  },
  completedAt: {
    type: Date,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

courseCertificateSchema.index({ user: 1, course: 1 }, { unique: true });
courseCertificateSchema.index({ user: 1, courseKey: 1 }, { unique: true });

module.exports = mongoose.model('CourseCertificate', courseCertificateSchema);

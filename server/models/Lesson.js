const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  content: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  objectives: {
    ar: [String],
    en: [String]
  },
  safetyNotes: {
    ar: { type: String },
    en: { type: String }
  },
  images: [String],
  order: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
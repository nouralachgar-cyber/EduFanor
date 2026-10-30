const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  questions: [{
    question: {
      ar: { type: String, required: true },
      en: { type: String, required: true }
    },
    options: {
      ar: [{ type: String }],
      en: [{ type: String }]
    },
    correctAnswer: { type: Number, required: true }, // Index of the correct option
    explanation: {
      ar: { type: String },
      en: { type: String }
    }
  }],
  passingScore: { type: Number, default: 70, min: 0, max: 100 },
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
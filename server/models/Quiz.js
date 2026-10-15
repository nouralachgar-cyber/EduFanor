const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
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
  }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
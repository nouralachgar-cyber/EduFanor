const mongoose = require('mongoose');

const aiQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: (value) => value.length >= 2 && value.length <= 6 },
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const aiQuizSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: null, index: true },
    sourceLabel: { type: String, default: '' },
    language: { type: String, enum: ['ar', 'en'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    model: { type: String, default: '' },
    questions: { type: [aiQuestionSchema], required: true },
    ephemeral: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiQuiz', aiQuizSchema);

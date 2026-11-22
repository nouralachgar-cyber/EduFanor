const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  verifiedCompletedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  lessonStarts: [{
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    startedAt: { type: Date, default: Date.now }
  }],
  quizAttempts: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    score: { type: Number, required: true },
    passed: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    attemptedAt: { type: Date, default: Date.now }
  }],
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
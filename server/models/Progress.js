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
  quizAttempts: [{
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    score: { type: Number, required: true },
    passed: { type: Boolean, default: false },
    attemptedAt: { type: Date, default: Date.now }
  }],
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
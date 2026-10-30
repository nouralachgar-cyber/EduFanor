const mongoose = require('mongoose');

const activityEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['course_start', 'course_complete', 'quiz_attempt', 'lesson_complete'],
    required: true,
    index: true
  },
  courseKey: { type: String, trim: true, index: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  score: { type: Number },
  total: { type: Number },
  percent: { type: Number },
  occurredAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

activityEventSchema.index({ user: 1, occurredAt: -1 });
activityEventSchema.index({ type: 1, occurredAt: -1 });

module.exports = mongoose.model('ActivityEvent', activityEventSchema);

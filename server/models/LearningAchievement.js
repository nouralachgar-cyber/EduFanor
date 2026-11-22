const mongoose = require('mongoose');

const learningAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  completedAt: { type: Date, required: true, default: Date.now },
  lessonCount: { type: Number, required: true, min: 1 },
  assessmentCount: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('LearningAchievement', learningAchievementSchema);

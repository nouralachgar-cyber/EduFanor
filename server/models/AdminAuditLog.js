const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: { type: String, required: true, trim: true },
  targetType: {
    type: String,
    enum: ['course', 'lesson', 'quiz', 'student', 'admin', 'platform'],
    required: true
  },
  targetId: { type: String, trim: true },
  targetLabel: { type: String, trim: true },
  details: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

adminAuditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AdminAuditLog', adminAuditLogSchema);

const mongoose = require('mongoose');

const aiOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    isBest: { type: Boolean, default: false },
    feedback: { type: String, default: '' },
  },
  { _id: false }
);

const aiScenarioSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, enum: ['choking', 'burn', 'unconscious', 'cardiac', 'bleeding', 'injury', 'surprise'], default: 'surprise' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    language: { type: String, enum: ['ar', 'en'], required: true },
    title: { type: String, default: '' },
    narrative: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [aiOptionSchema], required: true },
    suggestedLessonTitle: { type: String, default: '' },
    model: { type: String, default: '' },
    ephemeral: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiScenario', aiScenarioSchema);

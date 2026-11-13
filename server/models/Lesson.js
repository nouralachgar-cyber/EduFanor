const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'heading', 'subheading', 'paragraph', 'rich-text', 'image', 'figure', 'gallery', 'video', 'youtube', 'important', 'warning', 'safety', 'tip', 'steps', 'list', 'numbered-list', 'table', 'attachment', 'callout', 'note', 'divider'],
    required: true
  },
  content: { type: mongoose.Schema.Types.Mixed },
  data: { type: mongoose.Schema.Types.Mixed },
  order: { type: Number, default: 0 }
}, { _id: true });

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
    ar: { type: String },
    en: { type: String }
  },
  blocks: {
    ar: [blockSchema],
    en: [blockSchema]
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
  videoUrl: { type: String, trim: true },
  coverImage: { type: String },
  estimatedMinutes: { type: Number },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  sourceRefs: [{ type: String, trim: true }],
  reviewStatus: {
    type: String,
    enum: ['unreviewed', 'in_review', 'reviewed'],
    default: 'unreviewed'
  },
  published: { type: Boolean, default: false },
  order: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
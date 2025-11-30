const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  lessonNumber: { type: Number, required: true, index: true },
  slug: { type: String, index: true },
  description: String,
  wordIds: [{ wordId: String }],
  readingIds: [{ readingId: String }],
  speakingIds: [{ speakingId: String }],
  jlptLevel: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1', ''], default: '' },
  durationMinutes: { type: Number, default: 10 },
  published: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  createdBy: { adminId: String },
  updatedBy: { adminId: String },
}, { timestamps: true });


const Lesson = mongoose.model('Lesson', lessonSchema, "lessons");
module.exports = Lesson

const mongoose = require("mongoose");

const comprehensionQSchema = new mongoose.Schema({
  questionJP: { type: String, required: true },
  questionEN: String,
  type: { type: String, enum: ['mcq', 'short_answer'], default: 'mcq' },
  options: [{ text: String, isCorrect: Boolean }],
  answer: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const readingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  textJP: { type: String, required: true },
  textEN: String,
  audioUrl: String,
  comprehension: [comprehensionQSchema],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  createdBy: { adminId: String },
  updatedBy: { adminId: String },
}, { timestamps: true });



const Reading = mongoose.model('Reading', readingSchema, "readings");
module.exports = Reading

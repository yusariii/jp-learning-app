const mongoose = require("mongoose");

const listeningQSchema = new mongoose.Schema({
  questionJP: { type: String, required: true },
  questionEN: String,
  type: { type: String, enum: ['mcq', 'fill_blank', 'true_false', 'short_answer'], default: 'mcq' },
  options: [{ text: String, isCorrect: Boolean }],
  answer: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const listeningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
  transcriptJP: String,
  transcriptEN: String,
  questions: [listeningQSchema],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  createdBy: { adminId: String },
  updatedBy: { adminId: String },
}, { timestamps: true });

const Listening = mongoose.model('Listening', listeningSchema, "listenings");
module.exports = Listening;
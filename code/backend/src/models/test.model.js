const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/* ===== Common ===== */
const OptionSchema = new Schema({
  label: String,
  text: String,
}, { _id: false });

const BaseQuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: { type: [OptionSchema], default: [] },
  correctIndex: { type: Number, default: 0 },
  points: { type: Number, default: 1 },
  contextJP: String,   // dùng khi cần 1-2 câu ngữ cảnh
  mediaUrl: String,    // có thể dùng riêng từng câu nếu cần
}, { _id: false });

/* ===== Vocab / Grammar unit: Đề bài -> Câu hỏi ===== */
const SimpleUnitSchema = new Schema({
  title: String,                 // “Bài 1”, “Bài 2”… (tuỳ)
  instructionsJP: String,        // ĐỀ BÀI của “bài”
  instructionsEN: String,
  questions: { type: [BaseQuestionSchema], default: [] },
}, { _id: true });

/* ===== Reading: Đề bài -> Đoạn văn -> Câu hỏi ===== */
const ReadingPassageSchema = new Schema({
  title: String,
  passageJP: { type: String, required: true },
  passageEN: String,
  questions: { type: [BaseQuestionSchema], default: [] },
}, { _id: true });

const ReadingUnitSchema = new Schema({
  title: String,                 // “Bài 1”, “Bài 2”… (tuỳ)
  instructionsJP: String,        // ĐỀ BÀI của “bài” đọc hiểu
  instructionsEN: String,
  passages: { type: [ReadingPassageSchema], default: [] },
}, { _id: true });

/* ===== Listening: Đề bài -> URL -> Câu hỏi ===== */
const ListeningUnitSchema = new Schema({
  title: String,                 // “Bài 1”, …
  instructionsJP: String,        // ĐỀ BÀI nghe
  instructionsEN: String,
  mediaUrl: String,              // URL audio/video chính của “bài”
  questions: { type: [BaseQuestionSchema], default: [] },
}, { _id: true });

/* ===== Sections ===== */
const VocabSectionSchema = new Schema({
  totalTime: Number,                 // auto theo level
  vocabUnits: { type: [SimpleUnitSchema], default: [] },
}, { _id: false });

const GrammarReadingSectionSchema = new Schema({
  totalTime: Number,                 // auto theo level
  grammarUnits: { type: [SimpleUnitSchema], default: [] },
  readingUnits: { type: [ReadingUnitSchema], default: [] },
}, { _id: false });

const ListeningSectionSchema = new Schema({
  totalTime: Number,                 // auto theo level
  listeningUnits: { type: [ListeningUnitSchema], default: [] },
}, { _id: false });

/* ===== Test ===== */
const TestSchema = new Schema({
  title: { type: String, required: true },
  jlptLevel: { type: String, enum: ['N5','N4','N3','N2','N1'], required: true },
  description: String,

  vocabSection: { type: VocabSectionSchema, required: true },
  grammarReadingSection: { type: GrammarReadingSectionSchema, required: true },
  listeningSection: { type: ListeningSectionSchema, required: true },

  totalTime: Number,
  passingScorePercent: { type: Number, default: 70 },
  published: { type: Boolean, default: false },
}, { timestamps: true });

/* ===== Auto thời gian theo JLPT ===== */
const LEVEL_TIME = {
  N5: { vocab: 20, gramRead: 40, listen: 30 },
  N4: { vocab: 25, gramRead: 45, listen: 35 },
  N3: { vocab: 30, gramRead: 60, listen: 40 },
  N2: { vocab: 35, gramRead: 70, listen: 40 },
  N1: { vocab: 35, gramRead: 75, listen: 45 },
};

TestSchema.pre('validate', function () {
  const cfg = LEVEL_TIME[this.jlptLevel];
  if (!cfg) return;
  this.vocabSection ||= {};
  this.grammarReadingSection ||= {};
  this.listeningSection ||= {};
  this.vocabSection.totalTime ??= cfg.vocab;
  this.grammarReadingSection.totalTime ??= cfg.gramRead;
  this.listeningSection.totalTime ??= cfg.listen;
  this.totalTime = cfg.vocab + cfg.gramRead + cfg.listen;
});

module.exports = model('Test', TestSchema);

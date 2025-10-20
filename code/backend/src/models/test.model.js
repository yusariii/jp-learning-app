const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    type: { type: String, enum: ['mcq', 'fill_blank', 'speaking', 'reading', 'true_false', 'short_answer'], default: 'mcq' },
    promptJP: { type: String, required: true },
    promptEN: String,
    options: [{ text: String, isCorrect: Boolean }],
    answer: { type: mongoose.Schema.Types.Mixed },
    mediaUrl: String,
    points: { type: Number, default: 1 }
}, { _id: false });

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    level: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1'], required: true },
    type: { type: String, enum: ['listening', 'reading', 'vocab', 'grammar', 'mixed'], default: 'mixed' },
    description: { type: String, default: '' },
    questions: [questionSchema],
    timeLimitMinutes: { type: Number, default: 0 },
    passingScorePercent: { type: Number, default: 70 },
    published: { type: Boolean, default: false },
    createdBy: { adminId: String },
    updatedBy: { adminId: String },
}, { timestamps: true });


const Test = mongoose.model('Test', testSchema, "tests");
module.exports = Test

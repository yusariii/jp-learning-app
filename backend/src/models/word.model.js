const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  termJP: { type: String, required: true, trim: true },    // e.g. 食べる
  hiraKata: String,                 // たべる
  romaji: String,                   // taberu (optional)
  meaningVI: String,                // nghĩa tiếng Việt
  meaningEN: String,                
  kanji: String,
  examples: [
    {
      sentenceJP: String,
      readingKana: String,
      meaningVI: String
    }
  ],
  audioUrl: String,                 
  tags: { type: [String], default: [] },                
  jlptLevel: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1', ''], default: '' },
  createdBy: {
    adminId: String
  },
  updatedBy:{
    adminId: String
  },
}, { timestamps: true });


const Word = mongoose.model('Word', wordSchema, "words");
module.exports = Word;

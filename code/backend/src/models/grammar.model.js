const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({

}, { _id: false });

const grammarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    explanationJP: { type: String, required: true },
    explanationEN: String,
    examples: [{
        sentenceJP: { type: String, required: true },
        readingKana: String,
        meaningVI: String,
        meaningEN: String,
    }],
    jlptLevel: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1', ''], default: '' },
    createdBy: { adminId: String },
    updatedBy: { adminId: String },
}, { timestamps: true });

const Grammar = mongoose.model('Grammar', grammarSchema, "grammars");
module.exports = Grammar;
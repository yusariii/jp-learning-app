const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
    promptJP: { type: String, required: true },
    promptEN: String,
    expectedSample: String
}, { _id: false });

const speakingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    prompts: [promptSchema],
    guidance: String,
    sampleAudioUrl: String,
    createdBy: {
        adminId: String
    },
    updatedBy: {
        adminId: String
    }
}, { timestamps: true });


const Speaking = mongoose.model('Speaking', speakingSchema, "speakings");
module.exports = Speaking;

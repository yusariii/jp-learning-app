const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  lessonId: String,
  status: { type: String, enum: ['locked', 'active', 'completed'], default: 'locked' },
  stars: { type: Number, default: 0, min: 0, max: 5 },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  completedSections: {
    vocab: { type: Boolean, default: false },
    grammar: { type: Boolean, default: false },
    listening: { type: Boolean, default: false },
    reading: { type: Boolean, default: false },
    speaking: { type: Boolean, default: false },
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  fullName:  String,
  avatarUrl: String,
  level: { type: String, default: 'N5' },           
  streak: { type: Number, default: 0 },
  lastStudyAt: Date,
  progress: [progressSchema],
}, { timestamps: true });


const User = mongoose.model('User', userSchema, "users");
module.exports = User

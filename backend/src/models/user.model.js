const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  fullName:  String,
  avatarUrl: String,
  level: { type: String, default: 'N5' },           
  streak: { type: Number, default: 0 },
  lastStudyAt:  Date ,
}, { timestamps: true });


const User = mongoose.model('User', userSchema, "users");
module.exports = User

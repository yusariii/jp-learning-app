const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: String,
  fullName: String,
  role_id: String,
}, { timestamps: true });


const Admin = mongoose.model('Admin', adminSchema, "admins");

module.exports = Admin;

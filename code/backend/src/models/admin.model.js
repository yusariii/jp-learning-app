const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, trim: true },
  // đổi từ role_id String sang ObjectId ref Role để populate an toàn
  roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema, "admins");

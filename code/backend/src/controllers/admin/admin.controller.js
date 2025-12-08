const Admin = require("../../models/admin.model");
const Role = require("../../models/role.model");
const bcrypt = require("bcryptjs");

// helper
const pick = (obj, keys) => Object.fromEntries(keys.map(k => [k, obj[k]]).filter(([_,v]) => v !== undefined));

module.module.exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q = "" } = req.query;
    const filter = q ? { $or: [
      { email: new RegExp(q, "i") },
      { fullName: new RegExp(q, "i") },
    ]} : {};
    const [data, total] = await Promise.all([
      Admin.find(filter).populate("roleId", "title").sort({ updatedAt: -1 })
        .skip((page-1)*limit).limit(Number(limit)),
      Admin.countDocuments(filter)
    ]);
    res.json({ data, page: Number(page), limit: Number(limit), total });
  } catch (e) { next(e); }
};

module.exports.detail = async (req, res, next) => {
  try {
    const it = await Admin.findById(req.params.id).populate("roleId");
    if (!it) return res.status(404).json({ message: "Not found" });
    res.json(it);
  } catch (e) { next(e); }
};

module.exports.create = async (req, res, next) => {
  try {
    const { email, password, fullName, roleId } = req.body;
    if (!email || !password || !roleId) return res.status(400).json({ message: "Missing fields" });
    const role = await Role.findById(roleId);
    if (!role) return res.status(400).json({ message: "Invalid roleId" });

    const hashed = await bcrypt.hash(password, 10);
    const doc = await Admin.create({ email, password: hashed, fullName, roleId });
    const populated = await doc.populate("roleId", "title");
    res.status(201).json(populated);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Email already exists" });
    next(e);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { password, roleId } = req.body;
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(400).json({ message: "Invalid roleId" });
    }
    const patch = pick(req.body, ["email","fullName","roleId"]);
    if (password) patch.password = await bcrypt.hash(password, 10);

    const doc = await Admin.findByIdAndUpdate(req.params.id, patch, { new: true }).populate("roleId","title");
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Email already exists" });
    next(e);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const it = await Admin.findByIdAndDelete(req.params.id);
    if (!it) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

// tiện ích: trả về roles khả dụng để FE pick
module.exports.roles = async (_req, res, next) => {
  try {
    const roles = await Role.find({ deleted: { $ne: true } }).select("_id title description");
    res.json(roles);
  } catch (e) { next(e); }
};

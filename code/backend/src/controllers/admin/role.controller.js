const Role = require("../../models/role.model");

// tiện ích nhỏ
const pick = (obj, keys) => Object.fromEntries(
  keys.map(k => [k, obj[k]]).filter(([, v]) => v !== undefined)
);

// GET /api/admin/roles?q=&page=&limit=
exports.list = async (req, res, next) => {
  try {
    const { q = "", page = 1, limit = 50 } = req.query;
    const filter = { deleted: { $ne: true } };
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") }
      ];
    }
    const [data, total] = await Promise.all([
      Role.find(filter).sort({ updatedAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      Role.countDocuments(filter),
    ]);
    res.json({ data, page: Number(page), limit: Number(limit), total });
  } catch (e) { next(e); }
};

// GET /api/admin/roles/:id
exports.detail = async (req, res, next) => {
  try {
    const it = await Role.findById(req.params.id);
    if (!it || it.deleted) return res.status(404).json({ message: "Not found" });
    res.json(it);
  } catch (e) { next(e); }
};

// POST /api/admin/roles
exports.create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Missing title" });
    const doc = await Role.create({ title: title.trim(), description: description?.trim() });
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

// PUT /api/admin/roles/:id
exports.update = async (req, res, next) => {
  try {
    const patch = pick(req.body, ["title", "description"]);
    if (typeof patch.title === "string") patch.title = patch.title.trim();
    if (typeof patch.description === "string") patch.description = patch.description.trim();

    const doc = await Role.findOneAndUpdate(
      { _id: req.params.id, deleted: { $ne: true } },
      patch,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) { next(e); }
};

// DELETE /api/admin/roles/:id   (soft-delete)
exports.remove = async (req, res, next) => {
  try {
    const doc = await Role.findOneAndUpdate(
      { _id: req.params.id, deleted: { $ne: true } },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

/** (TÁCH RIÊNG) Phân quyền cho role — ở route khác
// GET/PUT /api/admin/role-permissions/:roleId
exports.getPermissions = async (req, res, next) => { ... }
exports.updatePermissions = async (req, res, next) => { ... }
*/

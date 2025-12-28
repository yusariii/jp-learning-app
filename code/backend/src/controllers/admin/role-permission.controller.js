// src/controllers/admin/role-permission.controller.js
const Role = require('../../models/role.model');

// Cấu hình feature & action cho phép (khớp với UI)
const FEATURES = ['word', 'grammar', 'reading', 'listening', 'lesson', 'test', 'admin', 'role'];
const ACTIONS = ['view', 'create', 'update', 'delete'];
const ALLOWED = new Set(FEATURES.flatMap(f => ACTIONS.map(a => `${f}.${a}`)));

const toMatrix = (arr = []) => {
  const matrix = {};
  for (const f of FEATURES) matrix[f] = { view: false, create: false, update: false, delete: false };
  arr.forEach(k => {
    if (!ALLOWED.has(k)) return;
    const [f, a] = k.split('.');
    matrix[f][a] = true;
  });
  return matrix;
};

const toArray = (matrix = {}) => {
  const out = [];
  for (const f of FEATURES) {
    const row = matrix[f] || {};
    for (const a of ACTIONS) if (row[a]) out.push(`${f}.${a}`);
  }
  // loại key lạ
  return out.filter(k => ALLOWED.has(k));
};

// GET /api/admin/roles/:roleId/permissions
module.exports.getForRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.roleId);
    if (!role || role.deleted) return res.status(404).json({ message: 'Role not found' });
    res.json({ roleId: role._id, permissions: toMatrix(role.permissions) });
  } catch (e) { next(e); }
};

// PUT /api/admin/roles/:roleId/permissions
// PUT /api/admin/content/roles/:roleId/permissions
module.exports.updateForRole = async (req, res, next) => {
  try {
    const { permissions } = req.body || {};
    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({ message: 'Invalid permissions' });
    }

    const role = await Role.findOne({ _id: req.params.roleId, deleted: { $ne: true } });
    if (!role) return res.status(404).json({ message: 'Role not found' });

    // chuyển matrix -> array: ["word.view", ...]
    const FEATURES = ['word', 'grammar', 'reading', 'listening', 'lesson', 'test', 'admin', 'role'];
    const ACTIONS = ['view', 'create', 'update', 'delete'];
    const toArray = (matrix = {}) => {
      const out = [];
      for (const f of FEATURES) for (const a of ACTIONS) if (matrix?.[f]?.[a]) out.push(`${f}.${a}`);
      return out;
    };

    role.permissions = toArray(permissions);
    console.log('before', role.permissions);
    await role.save();
    console.log('after', role.permissions);

    // trả lại matrix đã lưu
    const toMatrix = (arr = []) => {
      const m = {}; for (const f of FEATURES) m[f] = { view: false, create: false, update: false, delete: false };
      arr.forEach(k => { const [f, a] = k.split('.'); if (m[f]) m[f][a] = true; });
      return m;
    };
    res.json({ roleId: role._id, permissions: toMatrix(role.permissions) });
  } catch (e) { next(e); }
};

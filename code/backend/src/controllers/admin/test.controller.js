// controllers/admin/test.controller.js
const Test = require('../../models/test.model');

// GET /api/admin/content/test
module.exports.list = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      q = '',
      level = '',
      type = '',
      published = '',
      sort = 'updatedAt',
    } = req.query;

    const filter = {};

    if (q) {
      const rx = new RegExp(String(q).trim(), 'i');
      filter.$or = [
        { title: rx },
        { description: rx },
        { 'questions.promptJP': rx },
      ];
    }

    if (level) filter.level = level;
    if (type) filter.type = type;

    if (published !== '') {
      const v = String(published).toLowerCase();
      filter.published = ['true', '1', 'yes', 'on'].includes(v);
    }

    const sortMap = {
      updatedAt: -1,
      createdAt: -1,
      title: 1,
    };
    const sortSpec = sortMap[sort] ? { [sort]: sortMap[sort] } : { updatedAt: -1 };

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Test.find(filter).sort(sortSpec).skip(skip).limit(limitNum),
      Test.countDocuments(filter),
    ]);

    res.json({
      data,
      page: pageNum,
      limit: limitNum,
      total,
    });
  } catch (e) {
    next(e);
  }
};

// GET /api/admin/content/test/:id
module.exports.detail = async (req, res, next) => {
  try {
    const item = await Test.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
};

// POST /api/admin/content/test
module.exports.create = async (req, res, next) => {
  try {
    const payload = req.body || {};

    // Gán admin tạo nếu chưa có
    payload.createdBy =
      payload.createdBy || (req.user ? { adminId: String(req.user.id) } : undefined);

    const created = await Test.create(payload);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

// PUT /api/admin/content/test/:id
module.exports.update = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // Gán admin sửa nếu chưa có
    payload.updatedBy =
      payload.updatedBy || (req.user ? { adminId: String(req.user.id) } : undefined);

    const updated = await Test.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

// DELETE /api/admin/content/test/:id
module.exports.remove = async (req, res, next) => {
  try {
    const removed = await Test.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};

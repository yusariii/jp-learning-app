// controllers/listening.controller.js
const Listening = require('../../models/listening.model');

// GET /api/admin/content/listening
exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q = '', difficulty = '', sort = 'updatedAt' } = req.query;
    const filter = {};
    if (q) {
      const rx = new RegExp(q, 'i');
      filter.$or = [{ title: rx }, { transcriptJP: rx }, { transcriptEN: rx }, { 'questions.questionJP': rx }];
    }
    if (difficulty) filter.difficulty = difficulty;

    const sortMap = { updatedAt: -1, createdAt: -1, title: 1 };
    const sortSpec = sortMap[sort] ? { [sort]: sortMap[sort] } : { updatedAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Listening.find(filter).sort(sortSpec).skip(skip).limit(Number(limit)),
      Listening.countDocuments(filter),
    ]);
    res.json({ data, page: Number(page), limit: Number(limit), total });
  } catch (e) { next(e); }
};

// GET /api/admin/content/listening/:id
exports.detail = async (req, res, next) => {
  try {
    const item = await Listening.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
};

// POST /api/admin/content/listening
exports.create = async (req, res, next) => {
  try {
    const payload = req.body || {};
    payload.createdBy = payload.createdBy || (req.user ? { adminId: req.user.id } : undefined);
    const created = await Listening.create(payload);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

// PUT /api/admin/content/listening/:id
exports.update = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.updatedBy = payload.updatedBy || (req.user ? { adminId: req.user.id } : undefined);
    const updated = await Listening.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
};

// DELETE /api/admin/content/listening/:id
exports.remove = async (req, res, next) => {
  try {
    const removed = await Listening.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

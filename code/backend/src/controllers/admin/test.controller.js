// controllers/test.controller.js
const Test = require('../../models/test.model');

module.exports.list = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20, q = '', level = '', published = '',
      sort = 'updatedAt',
    } = req.query;

    const filter = {};
    if (q) {
      const rx = new RegExp(q, 'i');
      filter.$or = [{ title: rx }, { description: rx }, { 'questions.promptJP': rx }];
    }
    if (level) filter.level = level;
    if (published === 'true' || published === 'false') filter.published = published === 'true';

    const sortMap = { updatedAt: -1, createdAt: -1, title: 1 };
    const sortSpec = sortMap[sort] ? { [sort]: sortMap[sort] } : { updatedAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Test.find(filter).sort(sortSpec).skip(skip).limit(Number(limit)),
      Test.countDocuments(filter),
    ]);

    res.json({ data, page: Number(page), limit: Number(limit), total });
  } catch (e) { next(e); }
};

module.exports.detail = async (req, res, next) => {
  try {
    const it = await Test.findById(req.params.id);
    if (!it) return res.status(404).json({ message: 'Not found' });
    res.json(it);
  } catch (e) { next(e); }
};

module.exports.create = async (req, res, next) => {
  try {
    // Test model có middleware tự fill timeLimit + sections theo level JLPT :contentReference[oaicite:4]{index=4}
    const payload = req.body || {};
    payload.createdBy = payload.createdBy || (req.user ? { adminId: req.user.id } : undefined);
    const created = await Test.create(payload);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

module.exports.update = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.updatedBy = payload.updatedBy || (req.user ? { adminId: req.user.id } : undefined);
    const updated = await Test.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
};

module.exports.remove = async (req, res, next) => {
  try {
    const removed = await Test.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

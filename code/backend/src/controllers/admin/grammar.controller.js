const Grammar = require('../../models/grammar.model');
const paginationHelper = require('../../helpers/pagination');

// GET /admin/content/grammar
module.exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginationHelper.parsePagination(req);
    const { q = '', jlpt = '', sort = 'updatedAt' } = req.query;

    const query = {};
    if (q) {
      const rx = new RegExp(String(q).trim(), 'i');
      query.$or = [
        { title: rx },
        { description: rx },
        { explanationJP: rx },
        { explanationEN: rx },
        { 'examples.sentenceJP': rx },
        { 'examples.readingKana': rx },
        { 'examples.meaningVI': rx },
        { 'examples.meaningEN': rx },
      ];
    }
    if (jlpt) query.jlptLevel = jlpt;

    const sortObj = sort === 'title' ? { title: 1 } : { [sort]: -1 };

    const [data, total] = await Promise.all([
      Grammar.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Grammar.countDocuments(query),
    ]);

    res.json({ data, page, limit, total });
  } catch (err) {
    next(err);
  }
};

// GET /admin/content/grammar/:id
module.exports.detail = async (req, res, next) => {
  try {
    const doc = await Grammar.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// POST /admin/content/grammar
module.exports.create = async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (req.user?.id) {
      payload.createdBy = { adminId: String(req.user.id) };
      payload.updatedBy = { adminId: String(req.user.id) };
    }
    const doc = await Grammar.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// PUT /admin/content/grammar/:id
module.exports.edit = async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (req.user?.id) {
      payload.updatedBy = { adminId: String(req.user.id) };
    }
    const doc = await Grammar.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// DELETE /admin/content/grammar/:id
module.exports.remove = async (req, res, next) => {
  try {
    const doc = await Grammar.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

const Word = require('../../models/word.model');
const paginationHelper = require('../../helpers/pagination');

module.exports.list = async (req, res, next) => {
    try {
        const { page, limit, skip } = paginationHelper.parsePagination(req);
        const { q = '', jlpt = '', sort = 'updatedAt' } = req.query;

        const query = {};
        if (q) {
            const rx = new RegExp(String(q).trim(), 'i');
            query.$or = [
                { termJP: rx },
                { hiraKata: rx },
                { romaji: rx },
                { meaningVI: rx },
                { meaningEN: rx },
                { kanji: rx },
                { tags: rx },
            ];
        }
        if (jlpt) query.jlptLevel = jlpt;

        const sortObj = sort === 'termJP' ? { termJP: 1 } : { [sort]: -1 };

        const [data, total] = await Promise.all([
            Word.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
            Word.countDocuments(query),
        ]);

        res.json({ data, page, limit, total });
    } catch (err) {
        next(err);
    }
};

module.exports.detail = async (req, res, next) => {
    try {
        const doc = await Word.findById(req.params.id).lean();
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

module.exports.create = async (req, res, next) => {
    try {
        const payload = req.body || {};
        if (req.user?.id) {
            payload.createdBy = { adminId: String(req.user.id) };
            payload.updatedBy = { adminId: String(req.user.id) };
        }
        const doc = await Word.create(payload);
        res.status(201).json(doc);
    } catch (err) {
        next(err);
    }
};

module.exports.update = async (req, res, next) => {
    try {
        const payload = req.body || {};
        if (req.user?.id) {
            payload.updatedBy = { adminId: String(req.user.id) };
        }
        const doc = await Word.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

module.exports.remove = async (req, res, next) => {
    try {
        const doc = await Word.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
};

const Word = require('../../models/word.model');
const Grammar = require('../../models/grammar.model');

// GET /api/client/dictionary/words/search?q=keyword&jlptLevel=N5
module.exports.searchWords = async (req, res, next) => {
  try {
    const { q, jlptLevel, page = 1, limit = 20 } = req.query;
    console.log('[Dictionary] Search words - query:', q, 'level:', jlptLevel);

    if (!q || q.trim().length === 0) {
      return res.json({ data: [], total: 0, page: Number(page), limit: Number(limit) });
    }

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
      ];
    }
    if (jlptLevel) query.jlptLevel = jlptLevel;

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Word.find(query)
        .sort({ termJP: 1 })
        .skip(skip)
        .limit(Number(limit))
        .select('termJP hiraKata romaji meaningVI meaningEN kanji jlptLevel examples audioUrl')
        .lean(),
      Word.countDocuments(query),
    ]);

    console.log('[Dictionary] Found', total, 'words, returning', data.length, 'results');
    return res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/dictionary/grammar/search?q=keyword&jlptLevel=N5
module.exports.searchGrammar = async (req, res, next) => {
  try {
    const { q, jlptLevel, page = 1, limit = 20 } = req.query;
    console.log('[Dictionary] Search grammar - query:', q, 'level:', jlptLevel);

    if (!q || q.trim().length === 0) {
      return res.json({ data: [], total: 0, page: Number(page), limit: Number(limit) });
    }

    const query = {};
    if (q) {
      const rx = new RegExp(String(q).trim(), 'i');
      query.$or = [
        { title: rx },
        { description: rx },
        { explanationJP: rx },
        { explanationEN: rx },
      ];
    }
    if (jlptLevel) query.jlptLevel = jlptLevel;

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Grammar.find(query)
        .sort({ title: 1 })
        .skip(skip)
        .limit(Number(limit))
        .select('title description explanationJP explanationEN jlptLevel examples')
        .lean(),
      Grammar.countDocuments(query),
    ]);

    console.log('[Dictionary] Found', total, 'grammar, returning', data.length, 'results');
    return res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/dictionary/words/:id
module.exports.getWordDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const word = await Word.findById(id).lean();
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    return res.json(word);
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/dictionary/grammar/:id
module.exports.getGrammarDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grammar = await Grammar.findById(id).lean();
    
    if (!grammar) {
      return res.status(404).json({ message: 'Grammar not found' });
    }

    return res.json(grammar);
  } catch (e) {
    return next(e);
  }
};

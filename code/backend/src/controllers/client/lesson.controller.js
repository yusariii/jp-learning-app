const Lesson = require('../../models/lesson.model');
const Word = require('../../models/word.model');
const Grammar = require('../../models/grammar.model');
const User = require('../../models/user.model');

// GET /api/client/lesson - List all published lessons
module.exports.list = async (req, res, next) => {
  try {
    const { jlptLevel, page = 1, limit = 50, userId } = req.query;

    const filter = { published: true };
    if (jlptLevel) filter.jlptLevel = jlptLevel;

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Lesson.find(filter)
        .sort({ lessonNumber: 1 })
        .skip(skip)
        .limit(Number(limit))
        .select('_id title lessonNumber slug description jlptLevel')
        .lean(),
      Lesson.countDocuments(filter),
    ]);

    // If userId is provided, add user progress for each lesson
    if (userId) {
      const user = await User.findById(userId).select('progress').lean();
      const progressMap = {};
      
      if (user && user.progress) {
        user.progress.forEach(p => {
          if (p.lessonId) {
            progressMap[p.lessonId] = {
              status: p.status || 'locked',
              stars: p.stars || 0,
              completed: p.completed || false,
            };
          }
        });
      }

      // Merge progress with lessons
      data.forEach((lesson, index) => {
        const progress = progressMap[lesson._id] || { status: 'locked', stars: 0, completed: false };
        
        // Auto-unlock first 3 lessons for demo
        if (index < 3 && progress.status === 'locked') {
          progress.status = index < 2 ? 'completed' : 'active';
          progress.stars = index < 2 ? 3 : 0;
          progress.completed = index < 2;
        }
        
        lesson.userProgress = progress;
      });
    }

    return res.json({ data, page: Number(page), limit: Number(limit), total });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/lesson/:id
module.exports.detail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id).lean();
    if (!lesson || lesson.published === false) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const wordIds = (lesson.wordIds || [])
      .map((w) => w && w.wordId)
      .filter(Boolean);
    const grammarIds = (lesson.grammarIds || [])
      .map((g) => g && g.grammarId)
      .filter(Boolean);

    const [words, grammars] = await Promise.all([
      wordIds.length ? Word.find({ _id: { $in: wordIds } }).lean() : [],
      grammarIds.length ? Grammar.find({ _id: { $in: grammarIds } }).lean() : [],
    ]);

    return res.json({
      lesson,
      words,
      grammars,
    });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/lesson/:id/words - Get words only (for word-swipe)
module.exports.getWords = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id).select('wordIds published').lean();
    if (!lesson || lesson.published === false) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const wordIds = (lesson.wordIds || [])
      .map((w) => w && w.wordId)
      .filter(Boolean);

    const words = wordIds.length ? await Word.find({ _id: { $in: wordIds } }).lean() : [];

    return res.json({ words });
  } catch (e) {
    return next(e);
  }
};

module.exports.getGrammars = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id).select('grammarIds published').lean();
    if (!lesson || lesson.published === false) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const grammarIds = (lesson.grammarIds || [])
      .map((g) => g && g.grammarId)
      .filter(Boolean);

    const grammars = grammarIds.length ? await Grammar.find({ _id: { $in: grammarIds } }).lean() : [];

    return res.json({ grammars });
  } catch (e) {
    return next(e);
  }
};

module.exports.getListenings = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id).select('listeningIds published').lean();
    if (!lesson || lesson.published === false) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const listeningIds = (lesson.listeningIds || [])
      .map((l) => l && l.listeningId)
      .filter(Boolean);

    const Listening = require('../../models/listening.model');
    const listenings = listeningIds.length ? await Listening.find({ _id: { $in: listeningIds } }).lean() : [];

    return res.json({ listenings });
  } catch (e) {
    return next(e);
  }
};

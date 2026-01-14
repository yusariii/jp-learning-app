const Speaking = require('../../models/speaking.model');
const Lesson = require('../../models/lesson.model');

// GET /api/client/speaking/:lessonId
module.exports.getByLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    
    // Find lesson and get speakingIds
    const lesson = await Lesson.findById(lessonId).select('speakingIds').lean();
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const speakingIds = (lesson.speakingIds || [])
      .map(s => s && (s.speakingId || s))
      .filter(Boolean);
    
    const speakings = speakingIds.length 
      ? await Speaking.find({ _id: { $in: speakingIds } }).lean()
      : [];
    
    return res.json({ speakings });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/speaking/detail/:id
module.exports.detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const speaking = await Speaking.findById(id).lean();
    if (!speaking) {
      return res.status(404).json({ message: 'Speaking not found' });
    }
    return res.json(speaking);
  } catch (e) {
    return next(e);
  }
};

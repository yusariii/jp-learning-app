const Reading = require('../../models/reading.model');
const Lesson = require('../../models/lesson.model');

// GET /api/client/reading/:lessonId
module.exports.getByLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    
    // Find lesson and get readingIds
    const lesson = await Lesson.findById(lessonId).select('readingIds').lean();
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const readingIds = (lesson.readingIds || [])
      .map(r => r && (r.readingId || r))
      .filter(Boolean);
    
    const readings = readingIds.length 
      ? await Reading.find({ _id: { $in: readingIds } }).lean()
      : [];
    
    return res.json({ readings });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/reading/detail/:id
module.exports.detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reading = await Reading.findById(id).lean();
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }
    return res.json(reading);
  } catch (e) {
    return next(e);
  }
};

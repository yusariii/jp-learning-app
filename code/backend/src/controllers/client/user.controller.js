const User = require('../../models/user.model');

// GET /api/client/user/profile - Get current user profile
module.exports.getProfile = async (req, res, next) => {
  try {
    // Get user ID from middleware (token) or query param (fallback)
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};

// PUT /api/client/user/profile - Update user profile
module.exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fullName, level, avatar } = req.body;

    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (level !== undefined) updates.level = level;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select('-password').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/user/progress - Get user learning progress
module.exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('progress streak xp').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TODO: Tính toán progress từ các bài học đã hoàn thành
    // Tạm thời trả về mock data
    return res.json({
      progress: user.progress || [],
      streak: user.streak || 0,
      xp: user.xp || 0,
      totalLessonsCompleted: 0, // TODO: Count from progress
      totalWords: 0, // TODO: Count from completed lessons
    });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/user/practice-stats - Get practice mode statistics
module.exports.getPracticeStats = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TODO: Calculate from user's actual progress and test results
    // For now, return mock data structure that will be replaced with real calculations
    return res.json({
      dailyReview: {
        wordsToReview: 15,
        dueToday: true,
      },
      weakPoints: {
        incorrectCount: 8,
        topWeakCategories: ['grammar', 'listening'],
      },
      speedChallenge: {
        bestTime: 45,
        avgAccuracy: 75,
      },
    });
  } catch (e) {
    return next(e);
  }
};

// GET /api/client/user/skill-categories - Get skill categories with progress
module.exports.getSkillCategories = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.query.userId;

    // Categories are static but progress is user-specific
    const categories = [
      { 
        id: 'vocab', 
        title: 'Từ vựng', 
        icon: 'cards-outline', 
        color: '#4CAF50',
        totalWords: 0, // TODO: Count from database
        learnedWords: 0, // TODO: Count from user progress
      },
      { 
        id: 'grammar', 
        title: 'Ngữ pháp', 
        icon: 'format-quote-close', 
        color: '#9C27B0',
        totalGrammar: 0,
        learnedGrammar: 0,
      },
      { 
        id: 'kanji', 
        title: 'Hán tự', 
        icon: 'ideogram-cjk-variant', 
        color: '#FF5722',
        totalKanji: 0,
        learnedKanji: 0,
      },
      { 
        id: 'listen', 
        title: 'Nghe hiểu', 
        icon: 'headphones', 
        color: '#00BCD4',
        totalListening: 0,
        completedListening: 0,
      },
    ];

    if (userId) {
      // TODO: Fetch user progress and update counts
      // For now, categories have 0 progress
    }

    return res.json({ categories });
  } catch (e) {
    return next(e);
  }
};

// POST /api/client/user/progress/:lessonId/section - Update section completion
module.exports.updateSectionProgress = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.query.userId || req.body.userId;
    const { lessonId } = req.params;
    const { section } = req.body; // 'vocab', 'grammar', 'listening', 'reading', 'speaking'

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!['vocab', 'grammar', 'listening', 'reading', 'speaking'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section. Must be vocab, grammar, listening, reading, or speaking' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create progress for this lesson
    let lessonProgress = user.progress.find(p => p.lessonId === lessonId);
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonId,
        status: 'active',
        stars: 0,
        completed: false,
        completedSections: {
          vocab: false,
          grammar: false,
          listening: false,
          reading: false,
          speaking: false,
        }
      };
      user.progress.push(lessonProgress);
    }

    // Initialize completedSections if not exists
    if (!lessonProgress.completedSections) {
      lessonProgress.completedSections = {
        vocab: false,
        grammar: false,
        listening: false,
        reading: false,
        speaking: false,
      };
    }

    // Mark section as completed
    lessonProgress.completedSections[section] = true;

    // Calculate stars (1 star per completed section)
    const completedCount = Object.values(lessonProgress.completedSections).filter(Boolean).length;
    lessonProgress.stars = completedCount;

    // Mark lesson as completed if all sections done
    if (completedCount === 5) {
      lessonProgress.completed = true;
      lessonProgress.status = 'completed';
      lessonProgress.completedAt = new Date();
    }

    // Update lastStudyAt
    user.lastStudyAt = new Date();

    await user.save();

    return res.json({
      message: 'Progress updated',
      progress: lessonProgress,
    });
  } catch (e) {
    return next(e);
  }
};

const router = require('express').Router();
const userController = require('../../controllers/client/user.controller');
const { optionalAuth } = require('../../middlewares/auth.middleware');

// Apply optional auth to all routes (works with or without token)
router.use(optionalAuth);

// Get current user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Get user learning progress
router.get('/progress', userController.getProgress);

// Get practice mode statistics
router.get('/practice-stats', userController.getPracticeStats);

// Get skill categories with user progress
router.get('/skill-categories', userController.getSkillCategories);

// Update lesson section progress (vocab, grammar, listening)
router.post('/progress/:lessonId/section', userController.updateSectionProgress);

module.exports = router;

const router = require('express').Router();
const lessonController = require('../../controllers/client/lesson.controller');

// List all published lessons
router.get('/', lessonController.list);

// Get words only for lesson (for word-swipe)
router.get('/:id/words', lessonController.getWords);

// Get grammars only for lesson (for grammar practice)
router.get('/:id/grammars', lessonController.getGrammars);

// Get listenings only for lesson (for listening practice)
router.get('/:id/listenings', lessonController.getListenings);

// Get lesson detail with words and grammars
router.get('/:id', lessonController.detail);

module.exports = router;

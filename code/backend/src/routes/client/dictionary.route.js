const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/dictionary.controller');
const { optionalAuth } = require('../../middlewares/auth.middleware');

// Search routes
router.get('/words/search', optionalAuth, controller.searchWords);
router.get('/grammar/search', optionalAuth, controller.searchGrammar);

// Detail routes
router.get('/words/:id', optionalAuth, controller.getWordDetail);
router.get('/grammar/:id', optionalAuth, controller.getGrammarDetail);

module.exports = router;

const express = require('express');
const testController = require('../../controllers/client/test.controller');
const { optionalAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

// GET /api/client/test - List all published tests
router.get('/', testController.list);

// GET /api/client/test/:id - Get test detail
router.get('/:id', testController.detail);

// POST /api/client/test/:id/submit - Submit test answers (requires auth)
router.post('/:id/submit', optionalAuth, testController.submit);

module.exports = router;

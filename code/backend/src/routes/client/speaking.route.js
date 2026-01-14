const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/speaking.controller');
const { optionalAuth } = require('../../middlewares/auth.middleware');

router.get('/:lessonId', optionalAuth, controller.getByLesson);
router.get('/detail/:id', optionalAuth, controller.detail);

module.exports = router;

// routes/admin/lesson.route.js
const express = require('express');
const router = express.Router();
const lessonController = require('../../controllers/admin/lesson.controller');

router.get('/', lessonController.list);

router.get('/:id', lessonController.detail);

router.post('/', lessonController.create);

router.put('/:id', lessonController.update);

router.delete('/:id', lessonController.remove);

module.exports = router;

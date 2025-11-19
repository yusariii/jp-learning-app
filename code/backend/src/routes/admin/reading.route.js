const express = require('express');
const router = express.Router();
const readingController = require('../../controllers/admin/reading.controller');

router.get('/', readingController.list);

router.get('/:id', readingController.detail);

router.post('/', readingController.create);

router.put('/:id', readingController.update);

router.delete('/:id', readingController.remove);

module.exports = router;
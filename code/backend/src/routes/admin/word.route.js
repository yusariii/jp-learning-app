const express = require('express');
const router = express.Router();
const wordController = require('../../controllers/admin/word.controller');

router.get('/', wordController.list);

router.get('/:id', wordController.detail);

router.post('/', wordController.create);

router.put('/:id', wordController.edit);

router.delete('/:id', wordController.remove);

module.exports = router;

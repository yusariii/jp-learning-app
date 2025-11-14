const express = require('express');
const router = express.Router();
const grammarController = require('../../controllers/admin/grammar.controller');

router.get('/', grammarController.list);

router.get('/:id', grammarController.detail);

router.post('/', grammarController.create);

router.put('/:id', grammarController.edit);

router.delete('/:id', grammarController.remove);

module.exports = router;

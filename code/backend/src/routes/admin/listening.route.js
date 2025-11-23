const express = require('express');
const router = express.Router();
const listeningController = require('../../controllers/admin/listening.controller');

router.get('/', listeningController.list);

router.get('/:id', listeningController.detail);

router.post('/', listeningController.create);

router.put('/:id', listeningController.update);

router.delete('/:id', listeningController.remove);

module.exports = router;
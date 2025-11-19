// routes/speaking.route.js
const express = require('express');
const speakingController = require('../../controllers/admin/speaking.controller');
const router = express.Router();

router.get('/', speakingController.list);

router.get('/:id', speakingController.detail);

router.post('/', speakingController.create);

router.put('/:id', speakingController.update);

router.delete('/:id', speakingController.remove);

module.exports = router;

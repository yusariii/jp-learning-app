// routes/test.route.js
const express = require('express');
const router = express.Router();
const testController = require('../../controllers/admin/test.controller');

router.get('/', testController.list);

router.get('/:id', testController.detail);

router.post('/', testController.create);

router.put('/:id', testController.update);

router.delete('/:id', testController.remove);

module.exports = router;

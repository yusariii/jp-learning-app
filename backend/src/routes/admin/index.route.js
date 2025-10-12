const express = require('express');
const router = express.Router();
const adminWordRouter = require('./word.route');

router.use('/words', adminWordRouter);

module.exports = router;
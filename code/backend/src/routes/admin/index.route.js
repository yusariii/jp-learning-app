const express = require('express');
const router = express.Router();
const adminWordRouter = require('./word.route');

module.exports = (app) => {
    app.use("/words", adminWordRouter)
}
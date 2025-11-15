const express = require('express');
const router = express.Router();
const adminWordRouter = require('./word.route');
const adminGrammarRouter = require('./grammar.route');
const systemConfig = require('../../config/systemConfig'); 

module.exports = (app) => {
    const path = systemConfig.prefixAdmin;
    
    app.use(path + "/word", adminWordRouter)

    app.use(path + "/grammar", adminGrammarRouter);
}
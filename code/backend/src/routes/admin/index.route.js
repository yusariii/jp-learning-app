const express = require('express');
const router = express.Router();
const adminWordRouter = require('./word.route');
const systemConfig = require('../../config/systemConfig'); 

module.exports = (app) => {
    const path = systemConfig.prefixAdmin;
    
    app.use(path + "/words", adminWordRouter)
}
const express = require('express');
const wordRouter = require('./word.route');
const grammarRouter = require('./grammar.route');
const readingRouter = require('./reading.route');
const speakingRouter = require('./speaking.route');
const listeningRouter = require('./listening.route');
const lessonRouter = require('./lesson.route');
const testRouter = require('./test.route');
const adminRouter = require('./admin.route');
const roleRouter = require('./role.route');
const systemConfig = require('../../config/systemConfig'); 

module.exports = (app) => {
    const path = systemConfig.prefixAdmin;
    
    app.use(path + "/word", wordRouter)

    app.use(path + "/grammar", grammarRouter);

    app.use(path + "/reading", readingRouter);

    app.use(path + "/speaking", speakingRouter);

    app.use(path + "/listening", listeningRouter);

    app.use(path + "/lesson", lessonRouter);

    app.use(path + "/test", testRouter);

    app.use(path + "/admins", adminRouter);

    app.use(path + "/roles", roleRouter);
}
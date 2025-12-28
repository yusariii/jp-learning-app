const express = require('express');
// Import routers admin
const adminWordRouter = require('./admin/word.route');
const adminGrammarRouter = require('./admin/grammar.route');
const adminReadingRouter = require('./admin/reading.route');
const adminSpeakingRouter = require('./admin/speaking.route');
const adminListeningRouter = require('./admin/listening.route');
const adminLessonRouter = require('./admin/lesson.route');
const adminTestRouter = require('./admin/test.route');
const adminRouter = require('./admin/admin.route');
const roleRouter = require('./admin/role.route');
const rolePermissionRouter = require('./admin/role-permission.route');
const adminAuthRouter = require('./admin/auth.route');

// Import routers user
const authUserRouter = require('./client/auth.route');
const systemConfig = require('../config/systemConfig'); 

module.exports = (app) => {
    // Admin routes
    const path = systemConfig.prefixAdmin;
    
    app.use(path + "/word", adminWordRouter)

    app.use(path + "/grammar", adminGrammarRouter);

    app.use(path + "/reading", adminReadingRouter);

    app.use(path + "/speaking", adminSpeakingRouter);

    app.use(path + "/listening", adminListeningRouter);

    app.use(path + "/lesson", adminLessonRouter);
    
    app.use(path + "/test", adminTestRouter);

    app.use(path + "/admins", adminRouter);

    app.use(path + "/roles", roleRouter);

    app.use(path + "/roles", rolePermissionRouter);

    app.use(path + "/auth", adminAuthRouter);


    // User routes
    app.use("/auth", authUserRouter);
}
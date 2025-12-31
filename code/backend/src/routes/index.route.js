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
    const pathContent = systemConfig.prefixAdminContent; // /api/admin/content
    const pathSystem = systemConfig.prefixSystem; // /api/system
    const pathAPIAdmin = systemConfig.prefixAdminAPI; // /api/admin
    
    app.use(pathContent + "/word", adminWordRouter)

    app.use(pathContent + "/grammar", adminGrammarRouter);

    app.use(pathContent + "/reading", adminReadingRouter);

    app.use(pathContent + "/speaking", adminSpeakingRouter);

    app.use(pathContent + "/listening", adminListeningRouter);

    app.use(pathContent + "/lesson", adminLessonRouter);
    
    app.use(pathContent + "/test", adminTestRouter);

    app.use(pathSystem + "/admins", adminRouter);

    app.use(pathSystem + "/roles", roleRouter);

    app.use(pathSystem + "/roles", rolePermissionRouter);

    app.use(pathAPIAdmin + "/auth", adminAuthRouter);


    // User routes
    const pathAPIClient = systemConfig.prefixClientAPI; // /api/client
    app.use(pathAPIClient + "/auth", authUserRouter);
}
const router = require("express").Router();
const adminAuthController = require("../../controllers/admin/auth.controller");

router.post("/login", adminAuthController.login);

module.exports = router;

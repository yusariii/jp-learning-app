const router = require("express").Router();
const adminController = require("../../controllers/admin/admin.controller");

// /api/admin/admins
router.get("/", adminController.list);

router.get("/roles", adminController.roles);       // list roles để FE hiển thị picker

router.get("/:id", adminController.detail);

router.post("/", adminController.create);

router.put("/:id", adminController.update);

router.delete("/:id", adminController.remove);

module.exports = router;

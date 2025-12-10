const router = require("express").Router();
const roleController = require("../../controllers/admin/role.controller");

// /api/admin/roles
router.get("/", roleController.list);

router.get("/:id", roleController.detail);

router.post("/", roleController.create);

router.put("/:id", roleController.update);

router.delete("/:id", roleController.remove);

module.exports = router;

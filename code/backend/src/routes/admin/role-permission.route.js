// src/routes/admin/role-permission.route.js
const router = require('express').Router();
const rolePermissionController = require('../../controllers/admin/role-permission.controller');

// DÙNG NGAY TRÊN ROLE
// /api/admin/roles/:roleId/permissions
router.get('/:roleId/permissions', rolePermissionController.getForRole);
router.put('/:roleId/permissions', rolePermissionController.updateForRole);

module.exports = router;

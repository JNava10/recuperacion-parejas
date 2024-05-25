const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const RoleController = require("../controllers/role.controller");
const router = Router();

router.get('/', [validateToken], RoleController.getAllRoles);

module.exports = router;

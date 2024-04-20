const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/role.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const {isMD5} = require("validator");
const router = Router();

router.post('/member/search', UserController.findUser);

module.exports = router;
const {Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const {isAdmin, isMember} = require("../middlewares/role.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const {isMD5} = require("validator");
const router = Router();

router.post('/login', AuthController.login);
router.get('/test', [validateToken, isMember], () => console.log(true))
module.exports = router;
const {Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const {isAdmin, isMember} = require("../middlewares/role.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const UserController = require("../controllers/user.controller");
const router = Router();

router.post('/login', UserController.login);
router.get('/test', [validateToken, isMember], () => console.log(true))
module.exports = router;
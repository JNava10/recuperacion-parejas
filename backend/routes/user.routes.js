const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/role.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const router = Router();

router.post('/member/search', UserController.findUser); // Cambiar a GET

router.get('/member/messages/:receiver', [validateToken], UserController.getMessages)
router.post('/member/message', [validateToken], UserController.pushMessage)

module.exports = router;
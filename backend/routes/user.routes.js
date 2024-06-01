const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/role.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const router = Router();

router.post('/member/search', UserController.findUser); // Cambiar a GET

router.get('/member/messages/:receiver', [validateToken], UserController.getMessages)
router.post('/member/message', [validateToken], UserController.pushMessage)
router.get('/', [validateToken], UserController.getNotDeletedUsers)
router.get('/:id', [validateToken], UserController.findById)
router.put('/password/:id', [validateToken], UserController.updateUserPassword)
router.put('/data/:id', [validateToken], UserController.updateUserData)

router.get('/with-roles', [validateToken], UserController.getNotDeletedUsersWithRoles)
router.post('/', [validateToken], UserController.createUser)
router.post('/roles/:id', [validateToken], UserController.addUserRoles)
router.post('/roles/delete/:id', [validateToken], UserController.deleteUserRoles)
router.post('/register', [], UserController.registerUser)

router.post('/send-recover-mail', UserController.sendRecoverEmail)

module.exports = router;

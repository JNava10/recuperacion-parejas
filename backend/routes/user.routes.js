const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/role.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const router = Router();

router.post('/member/search', UserController.findUser); // TODO: Cambiar a GET

router.get('/member/messages/:receiver', [validateToken], UserController.getMessages)
router.post('/member/message', [validateToken], UserController.pushMessage)
router.put('/password/:id', [validateToken], UserController.updateUserPassword)
router.put('/data/:id', [validateToken], UserController.updateUserData)
router.get('/with-roles', [validateToken], UserController.getNotDeletedUsersWithRoles)
router.post('/', [validateToken], UserController.createUser)

router.post('/roles/:id', [validateToken], UserController.addUserRoles)
router.post('/roles/delete/:id', [validateToken], UserController.deleteUserRoles)
router.post('/register', [], UserController.registerUser)
router.get('/possible-matches', [validateToken], UserController.getPossibleMatches)
router.post('/send-recover-email', UserController.sendRecoverEmail)

router.post('/send-recover-code', UserController.checkRecoverCode)
router.put('/recover-account/password', UserController.changePasswordRecovering)
router.put('/enable-or-disable/:userId', [validateToken], UserController.enableOrDisableUser)
router.put('/profile/data/:id', [validateToken], UserController.editProfileData)

router.get('/pending-chats', [validateToken], UserController.getPendingChats)
router.post('/member/messages/files/:receiver', [validateToken], UserController.uploadMessageImages)
router.get('/profile', [validateToken], UserController.getEditableProfileData)
router.get('/:id', [validateToken], UserController.findById)
router.get('/', [validateToken], UserController.getNotDeletedUsers)

router.put('/avatar/:id', [validateToken], UserController.updateUserAvatar)
router.delete('/:id', [validateToken], UserController.deleteUser)

module.exports = router;

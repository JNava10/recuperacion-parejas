const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/userHasRole.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const AuthController = require("../controllers/auth.controller");
const ChatController = require("../controllers/chat.controller");
const RoleController = require("../controllers/role.controller");
const FriendshipController = require("../controllers/friendship.controller");
const {moreOneAdminRemaining} = require("../middlewares/role.middleware");
const {check} = require("express-validator");
const {emailMustNotExist, nicknameMustNotExist, userMustExist} = require("../helpers/validators/user.validators");
const {checkFields} = require("../middlewares/checkFields.middleware");
const {roleMustExist, rolesMustExist, roleIdsMustExist, hasAdminId} = require("../helpers/validators/role.validators");
const router = Router();

router.post('/member/search', UserController.findUser);

router.get('/member/messages/:receiver', [
    validateToken,
    check('receiver', 'El usuario no existe.').custom(userMustExist),
    checkFields
], ChatController.getMessages)

router.put('/password/:id', [
    validateToken,
    check('id', 'El usuario no existe').custom(userMustExist),
    checkFields
], UserController.updateUserPassword)

router.put('/data/:id', [
    validateToken,
    check('id', 'El usuario no existe.').custom(userMustExist),
    checkFields
], UserController.updateUserData)

router.get('/with-roles', [validateToken], UserController.getNotDeletedUsersWithRoles)

router.post('/', [
    validateToken,
    check('nickname', 'El nombre de usuario ya existe.').custom(nicknameMustNotExist),
    check('email', 'El email ya existe.').custom(emailMustNotExist),
    checkFields
], UserController.createUser)

router.post('/roles/:id', [
    validateToken,
    check('id', 'El usuario indicado no existe.').custom(userMustExist),
    check('roles', 'Algunos o todos los roles indicados no existen.').custom(roleIdsMustExist),
    checkFields
], RoleController.addUserRoles);

router.post('/roles/delete/:id', [
    validateToken,
    moreOneAdminRemaining,
    check('id').custom(userMustExist),
    check('roles').custom(roleIdsMustExist),
    checkFields
], RoleController.deleteUserRoles)

router.post('/register', [
    check('nickname', 'El nombre de usuario ya existe.').custom(nicknameMustNotExist),
    check('email', 'El email ya existe.').custom(emailMustNotExist),
    checkFields
], UserController.registerUser)

router.get('/possible-matches', [validateToken], FriendshipController.getPossibleMatches)
router.get('/role/:role', [validateToken], RoleController.getRoleUsers)

router.put('/enable-or-disable/:userId', [
    validateToken,
    check('userId', 'El ID introducido no existe.').custom(userMustExist),
    checkFields
], UserController.enableOrDisableUser)

router.put('/profile/data', [
    validateToken
], UserController.editProfileData)

router.get('/pending-chats', [validateToken], ChatController.getChats)
router.post('/member/messages/files/:receiver', [validateToken], ChatController.uploadMessageImages)

router.get('/role-users/:role', [
    validateToken,
    check('role', 'El rol introducido no existe.').custom(roleMustExist),
    checkFields
], UserController.getRoleUsersRemaining)

router.get('/profile', [validateToken], UserController.getEditableProfileData)

router.get('/', [validateToken], UserController.getNotDeletedUsers)

router.put('/preferences/:userId?', [
    validateToken,
    check('userId', 'El ID introducido no existe.').custom(userMustExist),
    checkFields
], UserController.updateUserPreferences)

router.post('/logout', AuthController.logout)

router.get('/notifications', [validateToken], UserController.getSelfNotifications)

router.put('/notifications/read', [validateToken], UserController.readUserNotifications)

router.get('/roles', [validateToken], RoleController.getSelfRoles)
router.get('/roles/name', [validateToken], RoleController.getSelfRoleNames)

router.put('/avatar/:userId', [
    validateToken,
    check('userId', 'El ID introducido no existe.').custom(userMustExist),
    checkFields
], UserController.updateUserAvatar)

router.delete('/:userId', [
    validateToken,
    check('userId', 'El ID introducido no existe.').custom(userMustExist),
    checkFields
], UserController.deleteUser)

router.get('/:id', [
    validateToken,
    check('id', 'El ID introducido no existe.').custom(userMustExist),
    checkFields
], UserController.findById)

router.post('/send-recover-email', UserController.sendRecoverEmail)
router.post('/send-recover-code', UserController.checkRecoverCode)
router.put('/recover-account/password', UserController.changePasswordRecovering)

module.exports = router;

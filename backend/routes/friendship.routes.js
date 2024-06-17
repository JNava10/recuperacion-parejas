const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/userHasRole.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const FriendshipController = require("../controllers/friendship.controller.js");
const {check} = require("express-validator");
const {roleMustExist} = require("../helpers/validators/role.validators");
const router = Router();


// router.get('/likables', [validateToken], FriendshipController.findLikableUsers);
router.get('/matched', [validateToken], FriendshipController.getOwnMatches);


router.post('/like/:id', [
    validateToken,
    check('role', 'El rol introducido no existe.').custom(roleMustExist),
], FriendshipController.likeUser);

module.exports = router;

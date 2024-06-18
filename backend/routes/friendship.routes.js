const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/userHasRole.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const FriendshipController = require("../controllers/friendship.controller.js");
const {check} = require("express-validator");
const {userMustExist} = require("../helpers/validators/user.validators");
const router = Router();


// router.get('/likables', [validateToken], FriendshipController.findLikableUsers);
router.get('/matched', [validateToken], FriendshipController.getOwnMatches);


router.post('/like/:id', [
    validateToken,
    check('id', 'El rol introducido no existe.').custom(userMustExist),
], FriendshipController.likeUser);

module.exports = router;

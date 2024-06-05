const {Router } = require('express');
const UserController = require('../controllers/user.controller');
const {isAdmin, isMember} = require("../middlewares/role.middleware");
const {validateToken} = require("../helpers/jwt.helper");
const FriendshipController = require("../controllers/friendship.controller.js");
const router = Router();


router.get('/likables', [validateToken], FriendshipController.findLikableUsers);
router.get('/matched', [validateToken], FriendshipController.getOwnMatches);
router.post('/like/:id', [validateToken], FriendshipController.likeUser);

module.exports = router;

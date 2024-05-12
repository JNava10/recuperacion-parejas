const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const EventController = require("../controllers/event.controller");
const router = Router();

router.post('/', [validateToken], EventController.createEvent);
router.get('/', [validateToken], EventController.getAllEvent);

module.exports = router;
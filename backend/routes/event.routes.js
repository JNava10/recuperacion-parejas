const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const EventController = require("../controllers/event.controller");
const router = Router();

router.post('/', [validateToken], EventController.createEvent);
router.put('/details', [validateToken], EventController.editEventDetails);
router.put('/place', [validateToken], EventController.editEventPlace);
router.delete('/:id', [validateToken], EventController.deleteEventById);
router.get('/', [validateToken], EventController.getAllEvent);

module.exports = router;
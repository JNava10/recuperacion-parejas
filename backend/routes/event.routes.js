const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const EventController = require("../controllers/event.controller");
const router = Router();

router.post('/subscribe/:id', [validateToken], EventController.subscribeEvent);
router.post('/', [validateToken], EventController.createEvent);
router.put('/details', [validateToken], EventController.editEventDetails);
router.put('/place', [validateToken], EventController.editEventPlace);
router.get('/', [validateToken], EventController.getAllEvent);
router.get('/available', [validateToken], EventController.getAvailableEvents);
router.get('/subscribed/:id', [validateToken], EventController.getIfSubscribedToEvent);
router.get('/:id', [validateToken], EventController.getEvent);
router.delete('/:id', [validateToken], EventController.deleteEventById);

module.exports = router;


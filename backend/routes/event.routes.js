const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const EventController = require("../controllers/event.controller");
const router = Router();

router.post('/', [validateToken], EventController.createEvent);
router.put('/details', [validateToken], EventController.editEventDetails);
router.put('/place', [validateToken], EventController.editEventPlace);
router.get('/', [validateToken], EventController.getAllEvent);
router.get('/available', [validateToken], EventController.getAvailableEvents);
router.post('/subscribe/:id', [validateToken], EventController.subscribeToEvent);
router.post('/withdraw/:id', [validateToken], EventController.withdrawEvent);
router.get('/registered', [validateToken], EventController.getEventsRegistered);
router.get('/subscribed/:id', [validateToken], EventController.getIfRegisteredToEvent);
router.post('/members/add/:eventId/:userId', [validateToken], EventController.addMemberToEvent);
router.get('/members/:id', [validateToken], EventController.getEventMembers);
router.get('/:id', [validateToken], EventController.getEvent);
router.delete('/:id', [validateToken], EventController.deleteEventById);
router.get('/summary/:id', [validateToken], EventController.getSummaryFile);
router.put('/pic/:id', [validateToken], EventController.updateEventPic);

module.exports = router;


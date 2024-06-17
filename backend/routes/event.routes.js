const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const EventController = require("../controllers/event.controller");
const router = Router();

router.post('/', [validateToken], EventController.createEvent);
router.put('/details', [validateToken], EventController.editEventDetails);
router.put('/place', [validateToken], EventController.editEventPlace);
router.get('/', [validateToken], EventController.getAllEvent);
router.get('/available', [validateToken], EventController.getAvailableEvents);
router.post('/subscribe/:eventId/:userId?', [validateToken], EventController.subscribeToEvent);
router.post('/withdraw/:eventId/:userId?', [validateToken], EventController.withdrawEvent);
router.get('/registered', [validateToken], EventController.getEventsRegistered);
router.get('/subscribed/:eventId', [validateToken], EventController.getIfRegisteredToEvent);
router.post('/members/add/:eventId/:userId', [validateToken], EventController.addMemberToEvent);
router.get('/members/:eventId', [validateToken], EventController.getEventMembers);
router.get('/not-members/:eventId', [validateToken], EventController.getEventNotMembers);
router.get('/:eventId', [validateToken], EventController.getEvent);
router.delete('/:eventId', [validateToken], EventController.deleteEventById);
router.get('/summary/:eventId', [validateToken], EventController.getSummaryFile);
router.put('/pic/:eventId', [validateToken], EventController.updateEventPic);

module.exports = router;


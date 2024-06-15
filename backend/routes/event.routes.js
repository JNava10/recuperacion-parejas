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
router.get('/subscribed/:id', [validateToken], EventController.getIfRegisteredToEvent);
router.post('/members/add/:eventId/:userId', [validateToken], EventController.addMemberToEvent);
router.get('/members/:id', [validateToken], EventController.getEventMembers);
router.get('/not-members/:id', [validateToken], EventController.getEventNotMembers);
router.get('/:id', [validateToken], EventController.getEvent);
router.delete('/:id', [validateToken], EventController.deleteEventById);
router.get('/summary/:id', [validateToken], EventController.getSummaryFile);
router.put('/pic/:id', [validateToken], EventController.updateEventPic);

module.exports = router;


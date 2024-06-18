const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const EventController = require("../controllers/event.controller");
const {check} = require("express-validator");
const {eventMustExist, eventMustNotClosed} = require("../helpers/validators/event.validators");
const {userMustExist} = require("../helpers/validators/user.validators");
const router = Router();

router.post('/', [validateToken], EventController.createEvent);

router.put('/details', [
    validateToken,
    check('id', 'El evento introducido no existe.').custom(eventMustExist),
    check('id', 'El evento está cerrado.').custom(eventMustNotClosed),
], EventController.editEventDetails);

router.put('/place', [
    validateToken,
    check('id', 'El evento introducido no existe.').custom(eventMustExist),
    check('id', 'El evento está cerrado.').custom(eventMustNotClosed),
], EventController.editEventPlace);

router.get('/', [validateToken], EventController.getAllEvent);

router.get('/available', [validateToken], EventController.getAvailableEvents);

router.post('/subscribe/:eventId/:userId?', [
    validateToken,
    check('eventId', 'El evento introducido no existe.').custom(eventMustExist),
    check('eventId', 'El evento está cerrado.').custom(eventMustNotClosed),
    check('userId', 'El usuario no existe.').custom(userMustExist),
], EventController.addMemberToEvent);

router.post('/withdraw/:eventId/:userId?', [
    validateToken,
    check('eventId', 'El evento introducido no existe.').custom(eventMustExist),
    check('eventId', 'El evento está cerrado.').custom(eventMustNotClosed),
    check('userId', 'El usuario no existe.').custom(userMustExist),
], EventController.withdrawEvent);

router.get('/registered', [validateToken], EventController.getEventsRegistered);

router.get('/subscribed/:eventId', [
    validateToken,
    check('eventId', 'El evento introducido no existe.').custom(eventMustExist),
    check('eventId', 'El evento está cerrado.').custom(eventMustNotClosed),
], EventController.getIfRegisteredToEvent);

router.post('/members/add/:eventId/:userId', [
    validateToken,
    check('eventId', 'El evento no existe.').custom(eventMustExist),
    check('eventId', 'El evento está cerrado.').custom(eventMustNotClosed),
    check('userId', 'El usuario no existe.').custom(userMustExist),
], EventController.addMemberToEvent);

router.get('/members/:eventId', [
    validateToken,
    check('eventId', 'El evento no existe.').custom(eventMustExist),
], EventController.getEventMembers);

router.get('/not-members/:eventId', [
    validateToken,
    check('eventId', 'El evento no existe.').custom(eventMustExist),
], EventController.getEventNotMembers);

router.get('/:eventId', [
    validateToken,
    check('eventId', 'El evento no existe.').custom(eventMustExist),
    check('eventId', 'El evento está cerrado.').custom(eventMustNotClosed),
], EventController.getEvent);

router.delete('/:eventId', [
    validateToken,
    check('eventId', 'El evento no existe.').custom(eventMustExist),
    check('eventId', 'El evento está cerrado.').custom(eventMustNotClosed),
], EventController.deleteEventById);

router.get('/summary/:eventId',  [
    validateToken,
    check('eventId', 'El evento no existe.').custom(eventMustExist),
], EventController.getSummaryFile);

router.put('/pic/:eventId',  [
    validateToken,
    check('eventId', 'El evento no existe.').custom(eventMustExist),
    check('eventId', 'El evento está cerrado.').custom(eventMustNotClosed),
], EventController.updateEventPic);

module.exports = router;


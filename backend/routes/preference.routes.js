const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const PreferenceController = require("../controllers/preference.controller");
const {check} = require("express-validator");
const {userMustExist} = require("../helpers/validators/user.validators");
const {checkFields} = require("../middlewares/checkFields.middleware");
const {preferenceMustExist} = require("../helpers/validators/preference.validators");
const router = Router();


router.get('/activated', [validateToken], PreferenceController.getNotDeletedPreferences);
router.post('/save/choice', [validateToken], PreferenceController.createChoicePreference);
router.post('/save/range', [validateToken], PreferenceController.createRangePreference);
router.get('/', [validateToken], PreferenceController.getAllPreferences);
router.post('/user', [validateToken], PreferenceController.createUserPreferences);
router.get('/own', [validateToken], PreferenceController.getOwnPreferences);

router.delete('/:id', [
    validateToken,
    check('id').custom(preferenceMustExist),
    checkFields
], PreferenceController.deletePreference);

module.exports = router;

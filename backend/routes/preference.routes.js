const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const PreferenceController = require("../controllers/preference.controller");
const router = Router();


router.get('/activated', [validateToken], PreferenceController.getActivatedPreferences);
router.post('/save/choice', [validateToken], PreferenceController.createChoicePreference);
router.post('/save/range', [validateToken], PreferenceController.createRangePreference);
router.get('/', [validateToken], PreferenceController.getAllPreferences);
router.post('/user-preferences', [validateToken], PreferenceController.createUserPreferences);
router.get('/own', [validateToken], PreferenceController.getOwnPreferences);
router.delete('/:id', [validateToken], PreferenceController.deletePreference);
router.get('/:id', [validateToken], PreferenceController.getPreference);
router.get('/', [validateToken], PreferenceController.getAllPreferences);

module.exports = router;

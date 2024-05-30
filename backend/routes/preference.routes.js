const {Router } = require('express');
const {validateToken} = require("../helpers/jwt.helper");
const PreferenceController = require("../controllers/preference.controller");
const router = Router();


router.get('/activated', [validateToken], PreferenceController.getActivatedPreferences);
router.post('/save/choice', [validateToken], PreferenceController.createChoicePreference);

module.exports = router;

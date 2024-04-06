const {Router } = require('express');
const controller = require('../controllers/auth.controller');
const router = Router();

router.get('/login', controller.login);
module.exports = router;
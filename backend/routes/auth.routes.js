const {Router } = require('express');
const UserController = require('../controllers/auth.controller');
const router = Router();

router.post('/login', UserController.login);
module.exports = router;
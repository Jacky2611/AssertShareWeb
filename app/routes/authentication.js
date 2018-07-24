var express = require('express');
var router = express.Router();
const authenticationController = require('../controllers/authenticationController');

router.post('/register', authenticationController.register);

router.post('/login', authenticationController.login);

router.get('/logout', authenticationController.logout);

router.get('/verify_email', authenticationController.verify_email);

module.exports = router;

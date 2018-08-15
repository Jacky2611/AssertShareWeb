var express = require('express');
var router = express.Router();
var mid = require('../middlewares/middleware');
const profileController = require('../controllers/profileController')

// Show a logged in user's private profile
router.get('/', mid.requiresLogin, profileController.show_own_profile);

//Show public profile
router.get('/:userId', profileController.show_public_profile);

module.exports = router;

var express = require('express');
var router = express.Router();
var mid = require('./../middleware');

// Show a logged in user's private profile
router.get('/', mid.requiresLogin, function(req, res, next) {
  res.render('profile', {title: req.session.username, owner: true, profilename: req.session.username});
});

//Show public profile
router.get('/:profileID', function(req, res, next) {
  res.render('profile', {title: req.session.username, profilename: req.session.username});
});

module.exports = router;

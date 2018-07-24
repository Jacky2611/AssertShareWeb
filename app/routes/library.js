var express = require('express');
var router = express.Router();
const libraryController = require('../controllers/libraryController');

/* GET home page. */
router.get('/', libraryController.show_library);

module.exports = router;

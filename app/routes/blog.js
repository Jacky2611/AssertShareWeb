var express = require('express');
var router = express.Router();
const blogController = require('../controllers/blogController');

/* GET home page. */
router.get('/', blogController.show_blog);

module.exports = router;

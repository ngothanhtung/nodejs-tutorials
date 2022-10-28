var express = require('express');
var router = express.Router();

// post, patch, delete, get

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

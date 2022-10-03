var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express 123456', subTitle: 'Aptech' });
});

module.exports = router;

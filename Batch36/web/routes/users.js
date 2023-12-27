var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    message: 'Users',
  });
});

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.send({
    message: 'Login',
  });
});

module.exports = router;

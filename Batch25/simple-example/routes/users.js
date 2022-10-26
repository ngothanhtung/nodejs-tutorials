var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
  res.send({ message: 'Hello express'});
});

module.exports = router;

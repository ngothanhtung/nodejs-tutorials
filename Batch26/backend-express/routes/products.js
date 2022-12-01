var express = require('express');
var router = express.Router();

const products = require('../data/products.json');

/* GET */
router.get('/', function (req, res, next) {
  res.send(products);
});

/* GET */
router.get('/test', function (req, res, next) {
  res.send('TEST PROPDUCT');
});

module.exports = router;

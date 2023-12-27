var express = require('express');
var router = express.Router();
var data = require('../data/customers.json');
var { write } = require('../helpers/fileHelper');
const fileName = './data/customers.json';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(data);
});

module.exports = router;

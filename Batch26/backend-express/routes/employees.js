var express = require('express');
var router = express.Router();

const employees = require('../data/employees.json');

/* GET */
router.get('/', function (req, res, next) {
  res.send(employees);
});

module.exports = router;

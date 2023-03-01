var express = require('express');
var router = express.Router();

const data = [
  { id: 1, name: 'admin', email: 'admin@gmail.com' },
  { id: 2, name: 'manager', email: 'manager@gmail.com' },
];

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all

router.get('/', function (req, res, next) {
  res.send(data);
});

module.exports = router;

var express = require('express');
var router = express.Router();

const data = [
  { id: 1, name: 'Peter', email: 'peter@gmail.com', address: 'USA' },
  { id: 2, name: 'John', email: 'john@gmail.com', address: 'ENGLAND' },
  { id: 3, name: 'Yamaha', email: 'yamaha@gmail.com', address: 'JAPAN' },
];

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', function (req, res, next) {
  res.send(data);
});

module.exports = router;

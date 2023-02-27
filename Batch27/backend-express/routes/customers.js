var express = require('express');
var router = express.Router();

const data = [
  { id: 1, name: 'Peter', email: 'peter@gmail.com', address: 'USA' },
  { id: 2, name: 'John', email: 'john@gmail.com', address: 'ENGLAND' },
  { id: 3, name: 'Yamaha', email: 'yamaha@gmail.com', address: 'JAPAN' },
];
// Methods: POST / PATCH / GET / DELETE / PUT

router.get('/', function (req, res, next) {
  res.send('This is customer router');
});

module.exports = router;

var express = require('express');
var router = express.Router();

const data = [
  { id: 1, name: 'Apple', email: 'apple@apple.com', country: 'USA' },
  { id: 2, name: 'Sony', email: 'sony@sony.com', country: 'JAPAN' },
  { id: 3, name: 'Xiaomi', email: 'xiaomi@xiaomi.com', country: 'CHINA' },
];

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', function (req, res, next) {
  res.send(data);
});

module.exports = router;

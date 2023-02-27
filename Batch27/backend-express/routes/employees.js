var express = require('express');
var router = express.Router();

const data = [
  { id: 1, name: 'Mary', email: 'mary@gmail.com', gender: 'female' },
  { id: 2, name: 'Honda', email: 'honda@gmail.com', gender: 'male' },
  { id: 3, name: 'Suzuki', email: 'suzuki@gmail.com', gender: 'male' },
];
// Methods: POST / PATCH / GET / DELETE / PUT

router.get('/', function (req, res, next) {
  res.send('This is customer router');
});

module.exports = router;

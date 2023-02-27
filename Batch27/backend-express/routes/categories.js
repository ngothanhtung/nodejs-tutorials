var express = require('express');
var router = express.Router();

const data = [
  { id: 1, name: 'Mobile Phone', description: 'Điện thoại' },
  { id: 2, name: 'Fashion', description: 'Thời trang' },
  { id: 3, name: 'Toys', description: 'Đồ chơi cho trẻ em' },
];
// Methods: POST / PATCH / GET / DELETE / PUT

router.get('/', function (req, res, next) {
  res.send('This is customer router');
});

module.exports = router;

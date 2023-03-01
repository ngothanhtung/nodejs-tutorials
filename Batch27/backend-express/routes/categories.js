var express = require('express');
var router = express.Router();

const { write } = require('../helpers/FileHelper');
let data = require('../data/categories.json');

const fileName = './data/categories.json';

// const data = [
//   { id: 1, name: 'Mobile Phone', description: 'Điện thoại' },
//   { id: 2, name: 'Fashion', description: 'Thời trang' },
//   { id: 3, name: 'Toys', description: 'Đồ chơi cho trẻ em' },
// ];

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', function (req, res, next) {
  res.send(data);
});

// Create new data
router.post('/', function (req, res, next) {
  const newItem = req.body;

  // Get max id
  let max = 0;
  data.forEach((item) => {
    if (max < item.id) {
      max = item.id;
    }
  });

  newItem.id = max + 1;

  data.push(newItem);

  // Write data to file
  write(fileName, data);

  res.send({ ok: true, message: 'Created' });
});
module.exports = router;

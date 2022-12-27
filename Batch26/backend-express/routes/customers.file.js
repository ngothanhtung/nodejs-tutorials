var express = require('express');
var router = express.Router();

const nanoid = require('nanoid');

var { write } = require('../helpers/FileHelper');

let customers = require('../data/customers.json');
const fileName = './data/customers.json';

/* GET */
router.get('/', function (req, res, next) {
  res.send(customers);
});

/* GET (PARAMS) */
router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  const found = customers.find((p) => {
    return p.id == id;
  });

  if (!found) {
    return res.status(404).json({ message: 'not found' });
  }

  res.send(found);
});

/* POST */
router.post('/', function (req, res, next) {
  const data = req.body;

  data.id = nanoid();
  console.log('Data =', data);
  customers.push(data);

  // Save to file
  write(fileName, customers);

  res.sendStatus(201);
});

/* PATCH */
router.patch('/:id', function (req, res, next) {
  const { id } = req.params;
  const data = req.body;
  console.log('Data = ', data);

  // Tìm data để sửa
  let found = customers.find((p) => {
    return p.id == id;
  });

  if (found) {
    // Cập nhật data gì?
    for (let x in data) {
      found[x] = data[x];
    }

    // Save to file
    write(fileName, customers);

    return res.sendStatus(200);
  }

  return res.status(404).json({ message: 'not found' });
});

/* DELETE (PARAMS) */
router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  const found = customers.find((p) => {
    return p.id == id;
  });

  if (!found) {
    return res.status(404).json({ message: 'not found' });
  }

  let remainData = customers.filter((p) => {
    return p.id != id;
  });

  // Save to file
  customers = remainData;
  write(fileName, customers);

  res.sendStatus(200);
});

module.exports = router;

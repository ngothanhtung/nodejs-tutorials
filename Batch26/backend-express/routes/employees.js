var express = require('express');
var router = express.Router();

var { write } = require('../helpers/fileHelper');

const employees = require('../data/employees.json');
const fileName = './data/employees.json';

/* GET */
router.get('/', function (req, res, next) {
  res.send(employees);
});

/* GET (PARAMS) */
router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  const found = employees.find((p) => {
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
  console.log('Data = ', data);
  employees.push(data);

  // Save to file
  write(fileName, employees);

  res.sendStatus(201);
});

/* PATCH */
router.patch('/:id', function (req, res, next) {
  const { id } = req.params;
  const data = req.body;
  console.log('Data = ', data);

  // Tìm data để sửa
  let found = employees.find((p) => {
    return p.id == id;
  });

  if (found) {
    // Cập nhật data gì?
    for (let x in found) {
      if (data[x]) {
        found[x] = data[x];
      }
    }

    // Save to file
    write(fileName, employees);

    return res.sendStatus(200);
  }

  return res.status(404).json({ message: 'not found' });
});

/* DELETE (PARAMS) */
router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  const found = employees.find((p) => {
    return p.id == id;
  });

  if (!found) {
    return res.status(404).json({ message: 'not found' });
  }

  let remainData = employees.filter((p) => {
    return p.id != id;
  });

  // Save to file
  write(fileName, remainData);

  res.sendStatus(200);
});

module.exports = router;

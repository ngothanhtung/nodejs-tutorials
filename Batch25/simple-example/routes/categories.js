const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/training-database');

var express = require('express');
var router = express.Router();

let data = [
  { id: 1, name: 'Thời trang' },
  { id: 2, name: 'Điện máy' },
  { id: 3, name: 'Máy tính' },
  { id: 4, name: 'Old Category' },
];

/* GET users listing. */
router.get('/', function (req, res, next) {
  try {
    Category.find().then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Category.findById(id).then((result) => {
      res.send(result);
      // console.log(result);
    });
  } catch (err) {
    // console.log(err);
    res.sendStatus(500);
  }
});

/* GET users listing. */

router.post('/', function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Category(data);
    newItem.save().then((result) => {
      res.send(result);
      // console.log(result);
    });
  } catch (err) {
    res.sendStatus(500);
    // console.log(err);
  }
});

router.patch('/:id', function (req, res, next) {
  const { id } = req.params;
  const { name, price } = req.body;

  let found = data.find((x) => {
    return x.id === parseInt(id);
  });

  found.name = name;
  found.price = price;

  res.send({ message: 'Updated' });
});

// DELETE
router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  data = data.filter((x) => x.id !== parseInt(id));

  console.log(id);
  res.send({ message: 'Deleted' });
});

module.exports = router;

const { CONNECTION_STRING } = require('../constants/dbSettings');
const { default: mongoose } = require('mongoose');

const { Product } = require('../models');
// MONGOOSE
mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_STRING);

var express = require('express');
var router = express.Router();

/* GET ALL */
router.get('/', function (req, res, next) {
  try {
    Product.find()
      .populate('category')
      .populate('supplier')
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

/* GET BY ID */
router.get('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Product.findById(id)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

/* POST */
router.post('/', function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Product(data);

    newItem
      .save()
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// PATCH
router.patch('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    Product.findByIdAndUpdate(id, data, {
      new: true,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

// DELETE
router.delete('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 1
// ------------------------------------------------------------------------------------------------
// https://www.mongodb.com/docs/manual/reference/operator/query/
router.get('/questions/1', function (req, res, next) {
  try {
    let query = { discount: { $lte: 10 } };
    Product.find(query)

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 1b
// ------------------------------------------------------------------------------------------------
// https://www.mongodb.com/docs/manual/reference/operator/query/
router.get('/questions/1b', function (req, res, next) {
  try {
    let query = { discount: { $lte: 10 } };
    Product.find(query)
      .populate('category')
      .populate('supplier')
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 3
// ------------------------------------------------------------------------------------------------
router.get('/questions/3', async (req, res, next) => {
  try {
    // let finalPrice = price * (100 - discount) / 100;
    const s = { $subtract: [100, '$discount'] }; // (100 - 5)
    const m = { $multiply: ['$price', s] }; // price * 95
    const d = { $divide: [m, 100] }; // price * 95 / 100

    let aggregate = [{ $match: { $expr: { $lte: [d, 100000] } } }];
    Product.aggregate(aggregate)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

const { default: mongoose } = require('mongoose');

const { Supplier } = require('../models');
// MONGOOSE
const { CONNECTION_STRING } = require('../constants/dbSettings');
mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_STRING);

var express = require('express');
var router = express.Router();

// GET
router.get('/', function (req, res, next) {
  try {
    Supplier.find()
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

// GET:id
router.get('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Supplier.findById(id)
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

// POST
router.post('/', function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Supplier(data);
    newItem
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// PATCH:/id
router.patch('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    Supplier.findByIdAndUpdate(id, data, {
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
    Supplier.findByIdAndDelete(id)
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
// QUESTIONS 15
// ------------------------------------------------------------------------------------------------
router.get('/questions/15', function (req, res, next) {
  try {
    const { supplierNames } = req.query;

    // const supplierNames = ['Samsung', 'Apple'];
    Supplier.aggregate([
      {
        $match: {
          name: { $in: supplierNames.split(',') },
        },
      },
    ])

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;

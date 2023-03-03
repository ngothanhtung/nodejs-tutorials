const { CONNECTION_STRING } = require('../constants/dbSettings');
const { default: mongoose } = require('mongoose');

const { Order } = require('../models');
// MONGOOSE
mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_STRING);

var express = require('express');

var router = express.Router();

// GET
router.get('/', function (req, res, next) {
  try {
    Order.find()
      .populate({ path: 'orderDetails.product', populate: { path: 'category' } })
      .populate('customer')
      .populate('employee')
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

// GET/:id
router.get('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Order.findById(id)
      .populate({ path: 'orderDetails.product', populate: { path: 'category' } })
      .populate('customer')
      .populate('employee')
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

    const newItem = new Order(data);
    newItem
      .save()
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

// PATCH/:id
router.patch('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    Order.findByIdAndUpdate(id, data, {
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
    Order.findByIdAndDelete(id)
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
// QUESTIONS 7
// ------------------------------------------------------------------------------------------------
router.get('/questions/7', function (req, res, next) {
  try {
    const { status } = req.query;
    Order.find({ status: status }, { createdDate: 1, status: 1, paymentType: 1, orderDetails: 1, customerId: 1 })
      .populate({ path: 'orderDetails.product', select: { name: 1, price: 1, discount: 1, stock: 1 } })
      .populate({ path: 'customer', select: 'firstName lastName' })
      .populate('employee')
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
// ------------------------------------------------------------------------------------------------
// QUESTIONS 8
// ------------------------------------------------------------------------------------------------
router.get('/questions/8', function (req, res, next) {
  try {
    const { status, date } = req.query;

    const fromDate = new Date(date);
    const toDate = new Date(new Date(date).setDate(fromDate.getDate() + 1));

    // console.log('fromDate', fromDate);
    // console.log('toDate', toDate);

    const compareStatus = { $eq: ['$status', status] };
    const compareFromDate = { $gte: ['$createdDate', fromDate] };
    const compareToDate = { $lt: ['$createdDate', toDate] };

    Order.aggregate([
      {
        $match: { $expr: { $and: [compareStatus, compareFromDate, compareToDate] } },
      },
    ])
      .project({ _id: 1, status: 1, paymentType: 1, createdDate: 1, orderDetails: 1, employeeId: 1, customerId: 1 })
      .then((result) => {
        // res.send(result);
        // POPULATE
        Order.populate(result, [{ path: 'employee' }, { path: 'customer' }, { path: 'orderDetails.product', select: { name: 0, price: 1, discount: 1 } }])
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 8B
// ------------------------------------------------------------------------------------------------
router.get('/questions/8b', function (req, res, next) {
  try {
    let { status, fromDate, toDate } = req.query;

    fromDate = new Date(fromDate);

    const tmpToDate = new Date(toDate);

    toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

    // console.log('fromDate', fromDate);
    // console.log('toDate', toDate);

    const compareStatus = { $eq: ['$status', status] };
    const compareFromDate = { $gte: ['$createdDate', fromDate] };
    const compareToDate = { $lt: ['$createdDate', toDate] };

    Order.aggregate([
      {
        $match: { $expr: { $and: [compareStatus, compareFromDate, compareToDate] } },
      },
    ])
      .project({ _id: 1, status: 1, paymentType: 1, createdDate: 1, orderDetails: 1, employeeId: 1, customerId: 1 })
      .then((result) => {
        // res.send(result);
        // POPULATE
        Order.populate(result, [{ path: 'employee' }, { path: 'customer' }, { path: 'orderDetails.product', select: { name: 1, price: 1, discount: 1 } }])
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
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

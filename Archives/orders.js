const { default: mongoose } = require('mongoose');

const { Order } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://127.0.0.1:27017/training-database');

var express = require('express');
const { findDocuments } = require('../../../Batch23/express-app/helpers/MongoDbHelper');
var router = express.Router();

// GET
router.get('/', function (req, res, next) {
  try {
    Order.find()
      .populate('orderDetails.product')
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
      .populate('orderDetails.product')
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
  // CÁCH 1
  try {
    const { status } = req.body;
    const aggregate = [
      // MATCH / FIND
      {
        $match: { status: status },
      },
      {
        $lookup: {
          from: 'customers', // foreign collection name
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer', // alias
        },
      },
      {
        $lookup: {
          from: 'employees', // foreign collection name
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee', // alias
        },
      },
      // ADD FIELDS
      {
        $addFields: {
          customer: { $first: '$customer' },
          employee: { $first: '$employee' },
        },
      },
      // PROJECT
      {
        $project: {
          _id: 1,
          createdDate: 1,
          status: 1,
          paymentType: 1,
          orderDetails: 1,
          'customer._id': 1,
          'customer.email': 1,
          'customer.firstName': 1,
          'customer.lastName': 1,
          'employee._id': 1,
          'employee.email': 1,
          'employee.firstName': 1,
          'employee.lastName': 1,
        },
      },
    ];
    findDocuments({ aggregate }, 'orders')
      .then((result) => {
        Order.populate(result, [{ path: 'employee' }, { path: 'customer' }, { path: 'orderDetails.product', select: { name: 1, price: 1, discount: 1, _id: 1 } }])
          .then((data) => {
            res.send(data);
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json(error);
          });

        // res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json(error);
      });
  } catch (err) {
    res.sendStatus(500);
  }

  // CÁCH 2: MONGOOSE
  // try {
  //   const { status } = req.query;
  //   Order.find({ status: status }, { status: 1, paymentType: 1, orderDetails: 1, customerId: 1, employeeId: 1 })
  //     .populate({ path: 'orderDetails.product', select: { name: 1, price: 1, discount: 1, stock: 1 } })
  //     .populate('customer')
  //     .populate('employee')
  //     .then((result) => {
  //       res.send(result);
  //     })
  //     .catch((err) => {
  //       res.status(400).send({ message: err.message });
  //     });
  // } catch (err) {
  //   console.log(err);
  //   res.sendStatus(500);
  // }
  // CACH 3
  // try {
  //   Order.aggregate([{ $match: { status: status } }])
  //     .lookup({
  //       from: 'customers',
  //       localField: 'customerId',
  //       foreignField: '_id',
  //       as: 'customer',
  //     })
  //     .addFields({
  //       customer: { $first: '$customer' },
  //     })
  //     .addFields({
  //       'customer.fullName': { $concat: ['$customer.firstName', ' ', '$customer.lastName'] },
  //     })
  //     .project({ _id: 1, employeeId: 1, 'customer.fullName': 1 })
  //     .then((result) => {
  //       Order.populate(result, [{ path: 'employee' }, { path: 'customer' }, { path: 'orderDetails.product', select: { name: 1, price: 1, discount: 1, _id: 0 } }]).then((data) => {
  //         res.send(data);
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(400).send({ message: err.message });
  //     });
  // } catch (error) {
  //   console.log(err);
  //   res.sendStatus(500);
  // }
});

module.exports = router;

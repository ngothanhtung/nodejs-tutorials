const yup = require('yup');
const express = require('express');
const router = express.Router();
const { Category, Product, Customer, Employee, Order, Supplier } = require('../models');
const { default: mongoose } = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

// ------------------------------------------------------------------------------------------------
// QUESTIONS 1a
// ------------------------------------------------------------------------------------------------
// http://localhost:9000/questions/1a?discount=10
router.get('/1a', function (req, res, next) {
  try {
    let param = req.query.discount;
    let query = { discount: { $lte: param } };
    Product.find(query)
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
// QUESTIONS 1b
// ------------------------------------------------------------------------------------------------
// http://localhost:9000/questions/1b?discount=10
router.get('/1b', function (req, res, next) {
  try {
    let discount = req.query.discount;
    let query = { discount: { $lte: discount } };
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
// QUESTIONS 2a
// ------------------------------------------------------------------------------------------------
// http://localhost:9000/questions/2a?stock=5
router.get('/2a', function (req, res, next) {
  try {
    let stock = req.query.stock;
    let query = { stock: { $lte: stock } };
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
// QUESTIONS 2b
// ------------------------------------------------------------------------------------------------
// http://localhost:9000/questions/2b?stock=5
router.get('/2b', function (req, res, next) {
  try {
    let stock = req.query.stock;
    let query = { stock: { $lte: stock } };
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
// http://localhost:9000/questions/3?price=100000
router.get('/3', async (req, res, next) => {
  try {
    // let finalPrice = price * (100 - discount) / 100;
    const s = { $subtract: [100, '$discount'] }; // (100 - 5)
    const m = { $multiply: ['$price', s] }; // price * 95
    const d = { $divide: [m, 100] }; // price * 95 / 100

    const { price } = req.query;

    let query = { $expr: { $lte: [d, parseFloat(price)] } };
    Product.find(query)
      .select('name price discount')
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

// ------------------------------------------------------------------------------------------------
// QUESTIONS 4
// ------------------------------------------------------------------------------------------------
// https://www.mongodb.com/docs/manual/reference/operator/query/
router.get('/4', function (req, res, next) {
  try {
    const text = 'Hải Châu';
    const query = { address: new RegExp(`${text}`) };
    // address có chứa từ Hải Châu

    Customer.find(query)
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
// QUESTIONS 5
// ------------------------------------------------------------------------------------------------
// https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/year/
router.get('/5', function (req, res, next) {
  try {
    const query = {
      $expr: {
        $eq: [{ $year: '$birthday' }, 1990],
      },
    };

    Customer.find(query)
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
// QUESTIONS 6
// ------------------------------------------------------------------------------------------------
// https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/month/
// https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/dayOfMonth/
// https://www.mongodb.com/docs/manual/reference/operator/query/
router.get('/6', function (req, res, next) {
  try {
    const today = new Date();
    const eqDay = { $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }] };
    const eqMonth = { $eq: [{ $month: '$birthday' }, { $month: today }] };

    const query = {
      $expr: {
        $and: [eqDay, eqMonth],
      },
    };

    Customer.find(query)
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
router.get('/7', function (req, res, next) {
  try {
    // const { status } = req.query;
    let status = 'WAITING';
    Order.find({ status: status })
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
router.get('/8a', function (req, res, next) {
  try {
    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareStatus = { $eq: ['$status', 'COMPLETED'] };
    const compareFromDate = { $gte: ['$createdDate', fromDate] };
    const compareToDate = { $lt: ['$createdDate', toDate] };
    const query = { $expr: { $and: [compareStatus, compareFromDate, compareToDate] } };

    Order.find(query)
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
// QUESTIONS 8B
// http://localhost:9000/questions/8b?fromDate=2023-03-27&toDate=2023-03-27&status=COMPLETED
// ------------------------------------------------------------------------------------------------
router.get('/8b', function (req, res, next) {
  try {
    let { status, fromDate, toDate } = req.query;

    fromDate = new Date(fromDate);

    const tmpToDate = new Date(toDate);
    toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

    const compareStatus = { $eq: ['$status', status] };
    const compareFromDate = { $gte: ['$createdDate', fromDate] };
    const compareToDate = { $lt: ['$createdDate', toDate] };

    const query = { $expr: { $and: [compareStatus, compareFromDate, compareToDate] } };

    Order.find(query)
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
    console.log(err);
    res.sendStatus(500);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 15
// ------------------------------------------------------------------------------------------------
router.get('/15', function (req, res, next) {
  try {
    let supplierNames = ['Apple', 'SONY'];
    let query = {
      name: { $in: supplierNames },
    };

    Supplier.find(query)
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
// QUESTIONS 25
// Hiển thị tất cả các mặt hàng không bán được
// ------------------------------------------------------------------------------------------------
router.get('/25', async (req, res, next) => {
  try {
    const aggregate = [{ $lookup: { from: 'orders', localField: '_id', foreignField: 'orderDetails.productId', as: 'orders' } }, { $match: { orders: { $size: 0 } } }];

    Product.aggregate(aggregate)
      .project({
        id: 1,
        name: 1,
        price: 1,
        stock: 1,
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

// ------------------------------------------------------------------------------------------------
// QUESTIONS 26
// Hiển thị tất cả các nhà cung cấp không bán được hàng
// ------------------------------------------------------------------------------------------------
router.get('/questions/26', async (req, res, next) => {
  try {
    const aggregate = [{ $lookup: { from: 'orders', localField: '_id', foreignField: 'orderDetails.productId', as: 'orders' } }, { $match: { orders: { $size: 0 } } }];

    Product.aggregate(aggregate)
      .lookup({
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'suppliers',
      })
      .project({
        _id: 0,
        suppliers: 1,
      })
      .unwind({
        path: '$suppliers',
        preserveNullAndEmptyArrays: true,
      })
      .addFields({
        _id: '$suppliers._id',
        name: '$suppliers.name',
        email: '$suppliers.email',
        phoneNumber: '$suppliers.phoneNumber',
        address: '$suppliers.address',
      })
      .project({
        suppliers: 0,
      })
      .group({
        _id: '$_id',
        name: { $first: '$name' },
        phoneNumber: { $first: '$phoneNumber' },
        email: { $first: '$email' },
        address: { $first: '$address' },
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

module.exports = router;

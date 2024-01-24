const yup = require('yup');
var express = require('express');
var router = express.Router();

const { default: mongoose } = require('mongoose');
const { Order } = require('../models');
const ObjectId = require('mongodb').ObjectId;

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', async (req, res, next) => {
  try {
    let results = await Order.find().populate('customer').populate('employee').populate('orderDetails.product');
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Create new data
router.post('/', async function (req, res, next) {
  try {
    const data = req.body;
    // SAVE TO DATABASE
    const newItem = new Order(data);
    let result = await newItem.save();

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 8
// ------------------------------------------------------------------------------------------------
router.get('/questions/8', function (req, res, next) {
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

module.exports = router;

const yup = require('yup');
const express = require('express');
const router = express.Router();
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
    const newItem = new Order(data);
    let result = await newItem.save();

    return res.send({ ok: true, message: 'Created', result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

module.exports = router;

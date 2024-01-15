const yup = require('yup');
var express = require('express');
var router = express.Router();

const { default: mongoose } = require('mongoose');
const { Employee } = require('../models');
const ObjectId = require('mongodb').ObjectId;

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', async (req, res, next) => {
  try {
    let results = await Employee.find();
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
    const newItem = new Employee(data);
    let result = await newItem.save();

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

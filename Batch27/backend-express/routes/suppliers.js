const express = require('express');
const router = express.Router();
const { Supplier } = require('../models');

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', async (req, res, next) => {
  try {
    let results = await Supplier.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

// Create new data
router.post('/', async function (req, res, next) {
  // Mongoose
  try {
    const data = req.body;
    const newItem = new Supplier(data);
    let result = await newItem.save();

    return res.send({ ok: true, message: 'Created', result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

module.exports = router;

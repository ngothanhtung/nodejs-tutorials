const yup = require('yup');
var express = require('express');
var router = express.Router();

const { default: mongoose } = require('mongoose');
const { Product } = require('../models');
const ObjectId = require('mongodb').ObjectId;

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', async (req, res, next) => {
  try {
    let results = await Product.find().populate('category').populate('supplier').lean({ virtuals: true });
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Create new data
router.post('/', async function (req, res, next) {
  // Validate body from client send to server
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().required().min(0),
      discount: yup.number().min(0).max(90).default(0),
      stock: yup.number().min(0).default(0),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      try {
        const data = req.body;

        // ----------------------------------------
        // AFTER VALIDATION API
        // TÍNH TOÁN THÊM CÁC TRƯỜNG KHÁC
        // ...

        // SAVE TO DATABASE
        const newItem = new Product(data);
        let result = await newItem.save();

        return res.status(201).json(result);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, provider: 'yup' });
    });
});

module.exports = router;

const yup = require('yup');
const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const ObjectId = require('mongodb').ObjectId;

// Methods: POST / PATCH / GET / DELETE / PUT

// ------------------------------------------------------------------------------------------------
// Get all
router.get('/', async (req, res, next) => {
  try {
    let results = await Product.find().populate('category').populate('supplier').lean({ virtuals: true });

    res.json(results);
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

// ------------------------------------------------------------------------------------------------
// Create new data
router.post('/', function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().positive().required(),
      discount: yup.number().positive().max(50).required(),
      categoryId: yup
        .string()
        .required()
        .test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .required()
        .test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;
      let newItem = new Product(data);
      await newItem.save();
      res.send({ ok: true, message: 'Created', result: newItem });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

// ------------------------------------------------------------------------------------------------
// Delete data
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);

  res.send({ ok: true, message: 'Deleted' });
});

router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const patchData = req.body;

  let found = data.find((x) => x.id == id);

  if (found) {
    for (let propertyName in patchData) {
      found[propertyName] = patchData[propertyName];
    }
  }

  res.send({ ok: true, message: 'Updated' });
});

// ------------------------------------------------------------------------------------------------
// Search
router.get('/search', function (req, res, next) {
  res.send('This is search router of products');
});

// ------------------------------------------------------------------------------------------------
// details
router.get('/details', function (req, res, next) {
  res.send('This is details router of products');
});

module.exports = router;

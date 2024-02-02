const yup = require('yup');
var express = require('express');
var router = express.Router();

const { validateSchema } = require('../validations/validateSchema');
const { createCategorySchema } = require('../validations/category.schema.yup');

const { Category } = require('../models');
const ObjectId = require('mongodb').ObjectId;

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get('/', async (req, res, next) => {
  try {
    let results = await Category.find();
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Get all
router.get('/check', async (req, res, next) => {
  try {
    let found = await Category.findOne({
      name: req.query.name,
    });

    if (found) {
      return res.json({ ok: true });
    }
    return res.json({ ok: false });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get('/:id', async function (req, res, next) {
  // Validate
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      const id = req.params.id;

      let found = await Category.findById(id);

      if (found) {
        return res.json(found);
      }

      return res.sendStatus(410);
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

// Create new data
router.post('/', validateSchema(createCategorySchema), async function (req, res, next) {
  try {
    const data = req.body;
    const newItem = new Category(data);
    let result = await newItem.save();

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// ------------------------------------------------------------------------------------------------
// Delete data
router.delete('/:id', function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;

        let found = await Category.findByIdAndDelete(id);

        if (found) {
          return res.json(found);
        }

        return res.sendStatus(410);
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

router.patch('/:id', async function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;
        const patchData = req.body;

        let found = await Category.findByIdAndUpdate(id, patchData);

        if (found) {
          return res.sendStatus(200);
        }

        return res.sendStatus(410);
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

module.exports = router;

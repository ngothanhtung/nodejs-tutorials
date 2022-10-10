var express = require('express');
var router = express.Router();

// Docs: https://github.com/jquense/yup
const yup = require('yup');

// Validate function
const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

router.get('/', (req, res, next) => {
  res.json({ message: 'This is products router' });
});

router.get('/search', (req, res, next) => {
  res.json({ message: 'This is products router - search' });
});

const productSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    price: yup.number().min(0).required(),
  }),
});

// Add validate function to middleware of express
router.post('/', validateSchema(productSchema), (req, res, next) => {
  //
  console.log(req.body);
  // Save to database
  // ...
  res.json({ message: 'This is products router - POST' });
});

module.exports = router;

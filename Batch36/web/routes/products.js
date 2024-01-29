const yup = require('yup');
var express = require('express');
var router = express.Router();

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

// http://localhost:3000/products/search?name=iphone
router.get('/search', async (req, res, next) => {
  try {
    let name = req.query.name;
    const query = { name: new RegExp(`${name}`) };

    let results = await Product.find(query).populate('category').populate('supplier').lean({ virtuals: true });
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

        let found = await Product.findByIdAndDelete(id);

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

        let found = await Product.findByIdAndUpdate(id, patchData);

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

router.get('/questions/1a', function (req, res, next) {
  try {
    // Get all products with discount <= 10%
    let query = { discount: { $lte: 10 } };
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

router.get('/questions/1b', function (req, res, next) {
  try {
    // Get all products with discount <= 10%
    let query = { discount: { $lte: 10 } };
    Product.find(query)
      .populate('category')
      .populate('supplier')
      .lean({ virtuals: true })
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

// http://localhost:3000/products/questions/1c?discount=10
router.get('/questions/1c', function (req, res, next) {
  try {
    const discount = req.query.discount;
    // Get all products with discount <= n%
    const query = { discount: { $lte: discount } };
    Product.find(query)
      .populate('category')
      .populate('supplier')
      .lean({ virtuals: true })
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

// http://localhost:3000/products/questions/1d?discountMin=10&discountMax=20
router.get('/questions/1d', function (req, res, next) {
  try {
    const { discountMin, discountMax } = req.query;

    // Get all products with discount <= n%
    const query = { discount: { $gte: parseFloat(discountMin), $lte: parseFloat(discountMax) } };
    Product.find(query)
      .populate('category')
      .populate('supplier')
      .lean({ virtuals: true })
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

// http://localhost:3000/products/questions/1d?discountMin=10&discountMax=20&priceMin=1000&priceMax=2000
router.get('/questions/1e', function (req, res, next) {
  try {
    const { discountMin, discountMax, priceMin, priceMax } = req.query;

    const query = {
      discount: { $gte: parseFloat(discountMin), $lte: parseFloat(discountMax) },
      price: { $gte: parseFloat(priceMin), $lte: parseFloat(priceMax) },
    };

    // const query = {
    //   $and: [{ discount: { $gte: parseFloat(discountMin), $lte: parseFloat(discountMax) } }, { price: { $gte: parseFloat(priceMin), $lte: parseFloat(priceMax) } }],
    // };

    Product.find(query)
      .populate('category')
      .populate('supplier')
      .lean({ virtuals: true })
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

router.get('/questions/3a', async (req, res, next) => {
  try {
    // let finalPrice = price * (100 - discount) / 100;

    const s = { $subtract: [100, '$discount'] }; // (100 - 5)
    const m = { $multiply: ['$price', s] }; // price * 95
    const d = { $divide: [m, 100] }; // price * 95 / 100

    const query = { $expr: { $lte: [d, parseFloat(1000)] } };
    Product.find(query)
      .lean({ virtuals: true })
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

// http://localhost:3000/products/questions/3b?price=1000
router.get('/questions/3b', async (req, res, next) => {
  try {
    // let finalPrice = price * (100 - discount) / 100;
    const price = req.query.price;

    const s = { $subtract: [100, '$discount'] }; // (100 - 5)
    const m = { $multiply: ['$price', s] }; // price * 95
    const d = { $divide: [m, 100] }; // price * 95 / 100

    let query = { $expr: { $lte: [d, parseFloat(price)] } };
    Product.find(query)
      .lean({ virtuals: true })
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

module.exports = router;

const { CONNECTION_STRING } = require('../constants/dbSettings');
const { default: mongoose } = require('mongoose');

const { Product, Order } = require('../models');
// MONGOOSE
mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_STRING);

const { findDocuments } = require('../helpers/MongoDbHelper');

var express = require('express');
var router = express.Router();

// GET
router.get('/', function (req, res, next) {
  try {
    Product.find()
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

// GET/:id
router.get('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Product.findById(id)
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

// POST
router.post('/', function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Product(data);
    newItem
      .save()
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

// PATCH/:id
router.patch('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    Product.findByIdAndUpdate(id, data, {
      new: true,
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

// DELETE
router.delete('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
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
// QUESTIONS 1
// ------------------------------------------------------------------------------------------------
router.get('/questions/1', async (req, res, next) => {
  try {
    let query = { discount: { $gte: 5 } };
    const results = await findDocuments({ query: query }, 'products');
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 2
// ------------------------------------------------------------------------------------------------
router.get('/questions/2', async (req, res, next) => {
  try {
    let query = { stock: { $lte: 5 } };
    const results = await findDocuments({ query }, 'products');
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 3
// ------------------------------------------------------------------------------------------------
router.get('/questions/3', async (req, res, next) => {
  // CÁCH 1
  // try {
  //   const s = { $subtract: [100, '$discount'] }; // (100 - 5)
  //   const m = { $multiply: ['$price', s] }; // price * 95
  //   const d = { $divide: [m, 100] }; // price * 95 / 100

  //   let aggregate = [{ $match: { $expr: { $lte: [d, 15000000] } } }];
  //   const results = await findDocuments({ aggregate }, 'products');

  //   res.json({ ok: true, results });
  // } catch (error) {
  //   res.status(500).json(error);
  // }

  // CÁCH 2
  try {
    const s = { $subtract: [100, '$discount'] }; // (100 - 5)
    const m = { $multiply: ['$price', s] }; // price * 95
    const d = { $divide: [m, 100] }; // price * 95 / 100

    let aggregate = [{ $match: { $expr: { $lte: [d, 15000000] } } }];
    Product.aggregate(aggregate)
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
// QUESTIONS 25
// ------------------------------------------------------------------------------------------------
router.get('/questions/25', async (req, res, next) => {
  try {
    const aggregate = [
      {
        $unwind: {
          path: '$orderDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $addFields: { productId: '$orderDetails.productId' } },
      { $project: { productId: 1 } },
      {
        $group: {
          _id: null,
          productIds: { $addToSet: '$productId' }, // Tạo mảng đã mua
        },
      },
      {
        $lookup: {
          from: 'products',
          let: { productIds: '$productIds' },
          pipeline: [{ $match: { $expr: { $not: { $in: ['$_id', '$$productIds'] } } } }],
          as: 'productsNotInOrderDetails',
        },
      },
      { $project: { productsNotInOrderDetails: 1, _id: 0 } },
    ];
    Order.aggregate(aggregate)
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

const yup = require('yup');
var { validateSchema } = require('../validations/validateSchema');

const { CONNECTION_STRING } = require('../constants/dbSettings');
const { default: mongoose } = require('mongoose');

const { Product, Order, Supplier } = require('../models');
// MONGOOSE
mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_STRING);

var express = require('express');
var router = express.Router();

/* GET ALL */
router.get('/', function (req, res, next) {
  try {
    Product.find({})
      .populate('category', 'name')
      .populate('supplier', 'name')
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

/* GET BY ID */
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

/* POST */
router.post('/', function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Product(data);

    newItem
      .save()
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// PATCH
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
// https://www.mongodb.com/docs/manual/reference/operator/query/
// http://localhost:9000/products/questions/1?discount=10

const question1Schema = yup.object({
  query: yup.object({
    discount: yup.number().integer().min(0).max(100).required(),
  }),
});

router.get('/questions/1', validateSchema(question1Schema), function (req, res, next) {
  try {
    let discount = req.query.discount;
    let query = { discount: { $lte: discount } };
    Product.find(query)
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

// ------------------------------------------------------------------------------------------------
// QUESTIONS 1b
// ------------------------------------------------------------------------------------------------
// https://www.mongodb.com/docs/manual/reference/operator/query/
router.get('/questions/1b', function (req, res, next) {
  try {
    let query = { discount: { $lte: 10 } };
    Product.find(query)
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

// ------------------------------------------------------------------------------------------------
// QUESTIONS 2
// ------------------------------------------------------------------------------------------------
// https://www.mongodb.com/docs/manual/reference/operator/query/
// http://localhost:9000/products/questions/2?stock=10
router.get('/questions/2', function (req, res, next) {
  try {
    let stock = req.query.stock;
    let query = { stock: { $lte: stock } };
    Product.find(query)
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

// ------------------------------------------------------------------------------------------------
// QUESTIONS 3
// ------------------------------------------------------------------------------------------------
// http://localhost:9000/products/questions/3?price=100000
router.get('/3', async (req, res, next) => {
  try {
    // let finalPrice = price * (100 - discount) / 100;
    const s = { $subtract: [100, '$discount'] }; // (100 - 5)
    const m = { $multiply: ['$price', s] }; // price * 95
    const d = { $divide: [m, 100] }; // price * 95 / 100

    const { price } = req.query;

    let query = { $expr: { $lte: [d, parseFloat(price)] } };
    Product.find(query)
      .select('name price discount')
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
// Hiển thị tất cả các mặt hàng không bán được
// ------------------------------------------------------------------------------------------------
router.get('/questions/25', async (req, res, next) => {
  try {
    const aggregate = [{ $lookup: { from: 'orders', localField: '_id', foreignField: 'orderDetails.productId', as: 'orders' } }, { $match: { orders: { $size: 0 } } }];

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
// QUESTIONS 26
// Hiển thị tất cả các nhà cung cấp không bán được hàng
// ------------------------------------------------------------------------------------------------
router.get('/questions/26', async (req, res, next) => {
  try {
    const aggregate = [{ $lookup: { from: 'orders', localField: '_id', foreignField: 'orderDetails.productId', as: 'orders' } }, { $match: { orders: { $size: 0 } } }];

    Product.aggregate(aggregate)
      .lookup({
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'suppliers',
      })
      .project({
        _id: 0,
        suppliers: 1,
      })
      .unwind({
        path: '$suppliers',
        preserveNullAndEmptyArrays: true,
      })
      .addFields({
        _id: '$suppliers._id',
        name: '$suppliers.name',
        email: '$suppliers.email',
        phoneNumber: '$suppliers.phoneNumber',
        address: '$suppliers.address',
      })
      .project({
        suppliers: 0,
      })
      .group({
        _id: '$_id',
        name: { $first: '$name' },
        phoneNumber: { $first: '$phoneNumber' },
        email: { $first: '$email' },
        address: { $first: '$address' },
      })

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

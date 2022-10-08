var express = require('express');
var router = express.Router();

const { insertDocument, updateDocument, findDocument, findDocuments } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema, supplierSchema } = require('./schemas.yup');

const COLLECTION_NAME = 'suppliers';

router.get('/', function (req, res, next) {
  findDocuments({}, COLLECTION_NAME, {}, 50, [
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'products',
      },
    },
  ])
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post('/', validateSchema(supplierSchema), function (req, res, next) {
  const data = req.body;
  insertDocument(data, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTION 15
// ------------------------------------------------------------------------------------------------
router.get('/question/15', function (req, res, next) {
  findDocuments(
    {
      // CÁCH 1:
      query: {
        name: { $in: ['SONY', 'SAMSUNG', 'TOSHIBA', 'APPLE'] },
      },
      // CÁCH 2
      // aggregate: [
      //   {
      //     $match: {
      //       name: { $in: ['SONY', 'SAMSUNG', 'TOSHIBA', 'APPLE'] },
      //     },
      //   },
      // ],
    },
    COLLECTION_NAME,
  )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 19
// ------------------------------------------------------------------------------------------------
router.get('/questions/19', function (req, res) {
  const aggregate = [
    {
      $lookup: {
        from: 'products',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$$id', '$supplierId'] },
            },
          },
        ],
        as: 'products',
      },
    },
    {
      $addFields: { numberOfProducts: { $size: '$products' } },
    },
  ];

  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 26
// Hiển thị tất cả các nhà cung cấp không bán được trong khoảng từ ngày, đến ngày
// ------------------------------------------------------------------------------------------------
router.get('/questions/26', function (req, res, next) {
  const aggregate = [
    {
      $unwind: {
        path: '$orderDetails',
        preserveNullAndEmptyArrays: true,
      },
    },

    { $addFields: { productId: '$orderDetails.productId' } },
    {
      $group: {
        _id: null,
        productIdsInOrderDetails: { $addToSet: '$productId' }, // Tạo mảng đã mua
      },
    },

    {
      $lookup: {
        from: 'products',
        let: { productIdsInOrderDetails: '$productIdsInOrderDetails' },
        pipeline: [{ $match: { $expr: { $not: { $in: ['$_id', '$$productIdsInOrderDetails'] } } } }],
        as: 'productsNotInOrderDetails',
      },
    },

    { $project: { productsNotInOrderDetails: 1, _id: 0 } },

    {
      $unwind: {
        path: '$productsNotInOrderDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'suppliers', // foreign collection name
        localField: 'productsNotInOrderDetails.supplierId',
        foreignField: '_id',
        as: 'supplier', // alias
      },
    },
    {
      $addFields: { 'productsNotInOrderDetails.supplier': { $first: '$supplier' } },
    },

    { $project: { productsNotInOrderDetails: 1, _id: 0 } },
  ];

  findDocuments({ aggregate: aggregate }, 'orders')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();

const { insertDocument, updateDocument, findDocument, findDocuments } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema, supplierSchema } = require('./schemas.yup');

const collectionName = 'orders';

router.get('/', function (req, res, next) {
  // const lookup = [
  //   {
  //     $lookup: {
  //       from: 'products',
  //       localField: 'orderDetails.productId',
  //       foreignField: '_id',
  //       as: 'orderDetails',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$orderDetails',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'categories',
  //       localField: 'orderDetails.categoryId',
  //       foreignField: '_id',
  //       as: 'orderDetails.category',
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'suppliers',
  //       localField: 'orderDetails.supplierId',
  //       foreignField: '_id',
  //       as: 'orderDetails.supplier',
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: '$_id',
  //       name: { $first: '$name' },
  //       orderDetails: { $push: '$orderDetails' },
  //     },
  //   },
  // ];

  const lookup = [
    {
      $lookup: {
        from: 'products',
        let: { productId: '_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$orderDetails.productId', '$$productId'],
              },
            },
          },
        ],
        as: 'orderDetails',
      },
    },
  ];

  findDocuments({}, collectionName, {}, 50, lookup, 0, {})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post('/', function (req, res, next) {
  const data = req.body;
  insertDocument(data, collectionName)
    .then((result) => {
      res.status(200).json({ ok: true, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

module.exports = router;

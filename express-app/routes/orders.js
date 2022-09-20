var express = require('express');
var router = express.Router();

const { insertDocument, updateDocument, findDocument, findDocuments } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema, supplierSchema } = require('./schemas.yup');

const collectionName = 'orders';

router.get('/', function (req, res, next) {
  const lookup = [
    {
      $lookup: {
        from: 'products',
        localField: 'orderDetails.productId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'categories',
              localField: 'orderDetails.categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
        ],
        as: 'products',
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

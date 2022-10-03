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

// MORE
router.get('/question/15', function (req, res, next) {
  findDocuments(
    {
      // CÁCH 1:
      query: {
        name: { $in: ['SONY', 'SAMSUNG'] },
      },
      // CÁCH 2
      // aggregate: [
      //   {
      //     $match: {
      //       name: { $in: ['SONY', 'SAMSUNG'] },
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

module.exports = router;

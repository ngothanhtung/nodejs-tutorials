var express = require('express');
var router = express.Router();
const yup = require('yup');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'api-training';

const { insertDocument, updateDocument, findDocument, findDocuments } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema } = require('./schemas.yup');

router.get('/', function (req, res, next) {
  findDocuments({}, 'categories', {}, 50, [
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

router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  findDocument(id, 'categories')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get(
  '/search/name',
  validateSchema(
    yup.object({
      query: yup.object({
        text: yup.string().required(),
      }),
    }),
  ),
  function (req, res, next) {
    const { text } = req.query;
    // Find documents where the address starts with the letter "S":

    // QUERY
    // const query = { name: text };
    const query = { name: new RegExp(`^${text}`) };

    // SORT
    // const sort = { price: 1 };
    const sort = { price: -1 };

    // LIMIT
    const limit = 1;
    findDocuments(query, 'categories', sort, limit)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  },
);

// router.post('/insert', validateSchema(categorySchema), function (req, res, next) {
//   // 1. OPEN
//   MongoClient.connect(url, function (err, db) {
//     // ERROR of CONNECT
//     if (err) {
//       res.status(500).json({ ok: false, error: err });
//       return;
//     }

//     const dbo = db.db(dbName);
//     const category = req.body;
//     dbo.collection('categories').insertOne(category, function (err, result) {
//       // ERROR of INSERT
//       if (err) {
//         res.status(500).json({ ok: false, error: err });
//         return;
//       }
//       // OK
//       res.json({ ok: true, result: result });
//       db.close();
//       return;
//     });
//   });
// });

router.post('/', validateSchema(categorySchema), function (req, res, next) {
  const data = req.body;
  insertDocument(data, 'categories')
    .then((result) => {
      res.status(200).json({ ok: true, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

router.patch('/:id', function (req, res, next) {
  const data = req.body;
  const { id } = req.params;
  updateDocument(id, data, 'categories')
    .then((result) => {
      res.status(200).json({ ok: true, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

module.exports = router;

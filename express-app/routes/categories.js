var express = require('express');
var router = express.Router();
const yup = require('yup');

const { insertDocument, updateDocument, findDocument, findDocuments } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema } = require('./schemas.yup');

router.get('/', function (req, res, next) {
  findDocuments({}, 'categories', { name: -1 }, 50, [])
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/products', function (req, res, next) {
  findDocuments({}, 'categories', {}, 50, [
    {
      $lookup: {
        from: 'products',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$$categoryId', '$categoryId'] },
            },
          },
        ],
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
    // const sort = { name: 1 };
    const sort = { name: -1 };

    // LIMIT
    const limit = 50;

    // SKIP
    const skip = 1;

    // PROJECTION: which columns you need
    const projection = { name: 1 };

    findDocuments({}, 'categories', sort, limit, [], skip, projection)
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

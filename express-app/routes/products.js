var express = require('express');
const { insertDocument, findDocuments } = require('../helpers/MongoDbHelper');
var router = express.Router();
var { validateSchema, productSchema } = require('./schemas.yup');

// ALL
// router.all('/', (req, res, next) => {
//   console.log('Accessing the secret section ...');
//   next(); // pass control to the next handler
// });

/* GET users listing. */
router.get('/', function (req, res, next) {
  const lookup = [
    {
      $lookup: {
        from: 'categories', // foreign collection name
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category', // alias
      },
    },
    {
      $lookup: {
        from: 'suppliers', // foreign collection name
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplier', // alias
      },
    },
  ];

  findDocuments({}, 'products', {}, 50, lookup)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/type', function (req, res, next) {
  res.send('type');
});

router.get('/kind', function (req, res, next) {
  res.send('kind');
});

// GET WITH PARAMS
router.get('/search/:name/type/:type', validateSchema(productSchema), (req, res) => {
  const name = req.params.name;
  const type = req.params.type;
  console.log('Params: ', req.params);
  const price = req.query.price;
  console.log(price);
  res.send('ab?cd');
});

// POST
router.post('/', validateSchema(productSchema), function (req, res, next) {
  const data = req.body;
  insertDocument(data, 'products')
    .then((result) => {
      res.status(200).json({ ok: true, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

// POST
router.post('/search', function (req, res, next) {
  const data = req.body;
  console.log(data);
  // Code here ....
  const result = [];
  res.json(result);
});

// DOWNLOAD
router.get('/download', function (req, res, next) {
  // res.send('OK');
  res.download('public/images/nature.jpeg');
});

module.exports = router;

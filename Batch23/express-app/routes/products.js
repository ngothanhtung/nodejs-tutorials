var express = require('express');
const { ObjectId } = require('mongodb');
const { insertDocument, findDocuments } = require('../helpers/MongoDbHelper');
var router = express.Router();
var { validateSchema, productSchema } = require('./schemas.yup');

const COLLECTION_NAME = 'products';

const lookupCategory = {
  $lookup: {
    from: 'categories', // foreign collection name
    localField: 'categoryId',
    foreignField: '_id',
    as: 'category', // alias
  },
};

const lookupSupplier = {
  $lookup: {
    from: 'suppliers', // foreign collection name
    localField: 'supplierId',
    foreignField: '_id',
    as: 'supplier', // alias
  },
};

router.get('/', function (req, res, next) {
  const aggregate = [
    lookupCategory,
    lookupSupplier,
    {
      $addFields: { category: { $first: '$category' }, supplier: { $first: '$supplier' } },
    },
  ];

  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// POST
router.post('/', validateSchema(productSchema), function (req, res, next) {
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
// QUESTIONS 1
// ------------------------------------------------------------------------------------------------

router.get('/questions/1', async (req, res, next) => {
  try {
    let query = { discount: { $lte: 10 } };
    const results = await findDocuments({ query: query }, COLLECTION_NAME);
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
    const results = await findDocuments({ query }, COLLECTION_NAME);
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 3
// ------------------------------------------------------------------------------------------------
router.get('/questions/3', async (req, res, next) => {
  try {
    const s = { $subtract: [100, '$discount'] }; // (100 - 5)
    const m = { $multiply: ['$price', s] }; // price * 95
    const d = { $divide: [m, 100] }; // price * 95 / 100

    let aggregate = [
      { $match: { $expr: { $lte: [d, 100000] } } },
      lookupCategory,
      lookupSupplier,
      {
        $addFields: { discountedPrice: d, category: { $first: '$category' }, supplier: { $first: '$supplier' } },
      },
    ];
    const results = await findDocuments({ aggregate }, COLLECTION_NAME);
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 17
// ------------------------------------------------------------------------------------------------
router.get('/questions/17', function (req, res, next) {
  const aggregate = [
    lookupCategory,
    lookupSupplier,
    {
      $addFields: { category: { $first: '$category' }, supplier: { $first: '$supplier' } },
    },
  ];

  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 25
// ------------------------------------------------------------------------------------------------
router.get('/questions/25', function (req, res, next) {
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

  findDocuments({ aggregate: aggregate }, 'orders')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// router.get('/', function (req, res, next) {
//   const aggregate = [
//     {
//       $lookup: {
//         from: 'categories', // foreign collection name
//         localField: 'categoryId',
//         foreignField: '_id',
//         as: 'category', // alias
//       },
//     },
//     {
//       $lookup: {
//         from: 'suppliers', // foreign collection name
//         localField: 'supplierId',
//         foreignField: '_id',
//         as: 'supplier', // alias
//       },
//     },
//   ];

//   findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
//     .then((result) => {
//       res.json(result);
//     })
//     .catch((error) => {
//       res.status(500).json(error);
//     });
// });

// router.get('/type', function (req, res, next) {
//   res.send('type');
// });

// router.get('/kind', function (req, res, next) {
//   res.send('kind');
// });

// // GET WITH PARAMS
// router.get('/search/:name/type/:type', validateSchema(productSchema), (req, res) => {
//   const name = req.params.name;
//   const type = req.params.type;
//   console.log('Params: ', req.params);
//   const price = req.query.price;
//   console.log(price);
//   res.send('ab?cd');
// });

// // POST
// router.post('/search', function (req, res, next) {
//   const data = req.body;
//   console.log(data);
//   // Code here ....
//   const result = [];
//   res.json(result);
// });

// // DOWNLOAD
// router.get('/download', function (req, res, next) {
//   // res.send('OK');
//   res.download('public/images/nature.jpeg');
// });

module.exports = router;

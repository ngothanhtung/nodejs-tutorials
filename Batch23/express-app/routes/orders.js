var moment = require('moment');
var express = require('express');
var router = express.Router();

const { insertDocument, updateDocument, findDocument, findDocuments, deleteDocument } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema, supplierSchema } = require('./schemas.yup');

const COLLECTION_NAME = 'orders';

router.get('/', function (req, res, next) {
  const aggregate = [
    {
      $lookup: {
        from: 'products',
        localField: 'orderDetails.productId',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: {
        path: '$products',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'products.categoryId',
        foreignField: '_id',
        as: 'products.category',
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'products.supplierId',
        foreignField: '_id',
        as: 'products.supplier',
      },
    },
    {
      $group: {
        _id: '$_id',
        code: { $first: '$code' },
        createdDate: { $first: '$createdDate' },
        products: {
          $push: {
            product: { _id: '$products._id', name: '$products.name', price: '$products.price', category: { $first: '$products.category' }, supplier: { $first: '$products.supplier' } },
            quantity: {
              $getField: {
                field: 'quantity',
                input: {
                  $first: {
                    $filter: {
                      input: '$orderDetails',
                      as: 'od',
                      cond: { $eq: ['$$od.productId', '$products._id'] },
                    },
                  },
                },
              },
            },
          },
        },
      },
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

router.post('/', function (req, res, next) {
  const data = req.body;
  insertDocument(data, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

// XÓA
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDocument(id, COLLECTION_NAME);
    res.json({ ok: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/question/7', function (req, res, next) {
  const query = {
    status: 'COMPLETED',
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/question/8', function (req, res, next) {
  const today = moment();
  const query = {
    $and: [
      {
        status: 'COMPLETED',
      },
      {
        createdDate: new Date(today.format('YYYY-MM-DD')),
      },
    ],
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/question/9', function (req, res, next) {
  const query = {
    status: 'CANCELED',
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/question/10', function (req, res, next) {
  const today = moment();

  const query = {
    $and: [
      {
        status: 'CANCELED',
      },
      {
        createdDate: new Date(today.format('YYYY-MM-DD')),
      },
    ],
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/question/11', function (req, res, next) {
  const query = {
    $and: [
      {
        paymentType: 'CASH',
      },
    ],
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/question/12', function (req, res, next) {
  const query = {
    $and: [
      {
        paymentType: 'CREDIT CARD',
      },
    ],
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/question/13', function (req, res, next) {
  const text = 'Hà Nội';
  const query = { shippingAddress: new RegExp(`${text}`) };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;

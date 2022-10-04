const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const yup = require('yup');

const { insertDocument, updateDocument, findDocument, findDocuments, deleteDocument } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema } = require('./schemas.yup');

const COLLECTION_NAME = 'categories';

router.get('/', async (req, res) => {
  try {
    let query = {};
    const results = await findDocuments({ query }, COLLECTION_NAME);
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

// TÌM THEO ID
const getByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
});

router.get('/:id', validateSchema(getByIdSchema), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await findDocument(id, COLLECTION_NAME);

    if (result) {
      res.json({ ok: true, result });
    } else {
      res.json({ ok: false, result });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// THÊM MỚI
router.post('/', validateSchema(categorySchema), async (req, res) => {
  try {
    const data = req.body;
    const result = await insertDocument(data, COLLECTION_NAME);
    res.status(201).json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// SỬA
router.patch('/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const result = await updateDocument(id, data, COLLECTION_NAME);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// XÓA
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDocument(id, COLLECTION_NAME);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 18
// ------------------------------------------------------------------------------------------------
router.get('/questions/18', function (req, res) {
  const aggregate = [
    {
      $lookup: {
        from: 'products',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$$id', '$categoryId'] },
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

// SEARCH BY NAME
const searchByNameSchema = yup.object({
  query: yup.object({
    text: yup.string().required(),
  }),
});

router.get('/search/name', validateSchema(searchByNameSchema), function (req, res) {
  const { text } = req.query;

  // QUERY
  // const query = { name: text };
  const query = { name: new RegExp(`${text}`) };
  // const query = { $text: { $search: 'toys' } };

  // SORT
  // const sort = { name: 1 };
  const sort = { name: -1 };

  // LIMIT
  const limit = 50;

  // SKIP
  const skip = 1;

  // PROJECTION: which columns you need
  const project = {};

  findDocuments(query, COLLECTION_NAME, sort, limit, [], skip, project)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// router.get('/products/all', function (req, res) {
//   const aggregate = [
//     {
//       $match: { _id: ObjectId('63293fea50d2f78624e0c6f3') },
//     },
//     {
//       $lookup: {
//         from: 'products',
//         let: { id: '$_id' },
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ['$$id', '$categoryId'] },
//             },
//           },
//         ],
//         as: 'products',
//       },
//     },
//   ];

//   findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
//     .then((result) => {
//       res.json(result);
//     })
//     .catch((error) => {
//       res.status(400).json(error);
//     });
// });

module.exports = router;

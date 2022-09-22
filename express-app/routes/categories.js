const express = require('express');
const router = express.Router();
const yup = require('yup');

const { insertDocument, updateDocument, findDocument, findDocuments, deleteDocument } = require('../helpers/MongoDbHelper');
const { validateSchema, categorySchema } = require('./schemas.yup');

const COLLECTION_NAME = 'categories';

router.get('/', async (req, res) => {
  try {
    let query = {};
    const results = await findDocuments(query, COLLECTION_NAME);
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

// TÌM THEO ID
const validateGetById = () => {
  return validateSchema(
    yup.object({
      params: yup.object({
        id: yup.string().required(),
      }),
    }),
  );
};

router.get('/:id', validateGetById, async (req, res) => {
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

// SEARCH BY NAME
const validateSearchByName = () => {
  return validateSchema(
    yup.object({
      query: yup.object({
        text: yup.string().required(),
      }),
    }),
  );
};

router.get('/search/name', validateSearchByName, function (req, res) {
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

router.get('/products', function (req, res) {
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

module.exports = router;

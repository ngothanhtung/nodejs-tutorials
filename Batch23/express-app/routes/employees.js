var moment = require('moment');
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const { insertDocument, findDocuments } = require('../helpers/MongoDbHelper');

const COLLECTION_NAME = 'employees';

router.get('/', async (req, res) => {
  try {
    let query = {};
    const results = await findDocuments({ query }, COLLECTION_NAME);
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

// THÊM MỚI
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const result = await insertDocument(data, COLLECTION_NAME);
    res.status(201).json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 14
// ------------------------------------------------------------------------------------------------
router.get('/questions/14', function (req, res) {
  const today = new Date();
  const query = {
    $expr: {
      $and: [{ $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }] }, { $eq: [{ $month: '$birthday' }, { $month: today }] }],
    },
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;

var moment = require('moment');
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const { insertDocument, findDocuments } = require('../helpers/MongoDbHelper');

const COLLECTION_NAME = 'customers';

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
// QUESTIONS 4
// ------------------------------------------------------------------------------------------------
router.get('/questions/4', function (req, res) {
  const text = 'Hai Chau';
  const query = { address: new RegExp(`${text}`) };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 5
// ------------------------------------------------------------------------------------------------
router.get('/questions/5', function (req, res) {
  const query = {
    $expr: {
      $eq: [{ $year: '$birthday' }, 1990],
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

// ------------------------------------------------------------------------------------------------
// QUESTIONS 6
// ------------------------------------------------------------------------------------------------
router.get('/questions/6', function (req, res) {
  const today = new Date();
  const eqDay = { $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }] };
  const eqMonth = { $eq: [{ $month: '$birthday' }, { $month: today }] };

  const query = {
    $expr: {
      $and: [eqDay, eqMonth],
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

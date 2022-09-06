var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'api-training';

const { insertDocument, updateDocument, findDocument } = require('../helpers/MongoDbHelper');

router.get('/', function (req, res, next) {
  res.json({ ok: true });
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

router.post('/', function (req, res, next) {
  // 1. OPEN

  MongoClient.connect(url, function (err, db) {
    // ERROR of CONNECT
    if (err) {
      res.status(500).json({ ok: false, error: err });
      return;
    }

    const dbo = db.db(dbName);
    const category = req.body;
    dbo.collection('categories').insertOne(category, function (err, result) {
      // ERROR of INSERT
      if (err) {
        res.status(500).json({ ok: false, error: err });
        return;
      }
      // OK
      res.json({ ok: true, result: result });
      db.close();
      return;
    });
  });

  // res.status(500).json({ ok: false });
});

router.post('/insert', function (req, res, next) {
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

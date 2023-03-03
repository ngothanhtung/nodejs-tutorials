const { CONNECTION_STRING } = require('../constants/dbSettings');
const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_STRING);

const { findDocuments } = require('../helpers/MongoDbHelper');

var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  try {
    Category.find()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

/* GET users listing. */
router.get('/products', function (req, res, next) {
  next();
});

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Category.findById(id)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

/* GET users listing. */

router.post('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Category(data);

    newItem
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// PATCH
router.patch('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    Category.findByIdAndUpdate(id, data, {
      new: true,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

// DELETE
router.delete('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    Category.findByIdAndDelete(id)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
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

  findDocuments({ aggregate: aggregate }, 'categories')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

module.exports = router;

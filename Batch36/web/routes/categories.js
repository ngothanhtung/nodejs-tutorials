const yup = require('yup');
var express = require('express');
var router = express.Router();
var data = require('../data/categories.json');
const _ = require('lodash');

var { write } = require('../helpers/fileHelper');

const fileName = './data/categories.json';

const createSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    description: yup.string(),
  })
  .required();

/* GET users listing. */

router.get('/', function (req, res, next) {
  res.send(data);
});

// Get one by id
router.get('/:id', function (req, res, next) {
  const id = req.params.id;

  let found = data.find((x) => x.id == id);

  if (found) {
    return res.send(found);
  }

  return res.sendStatus(410);
});

router.get('/search/text', function (req, res, next) {
  const name = req.query.name;
  const price = req.query.price;
  const color = req.query.color;
  console.log(req.query);
  res.send();
});

// Add new category
router.post('/', function (req, res, next) {
  const body = req.body;

  createSchema
    .validate(body, { abortEarly: false })
    .then((value) => {
      // Auto generate id
      // MAX ID by LODASH // npm install lodash -- save
      let maxId = _.maxBy(data, 'id')?.id;

      if (maxId === undefined) {
        maxId = 1;
      } else {
        maxId++;
      }

      body.id = maxId;
      data.push(body);
      write(fileName, data);
      return res.status(201).send();
    })
    .catch((err) => {
      // Something went wrong
      console.log(err);
      return res.status(400).send(err.errors);
    });
});

// Get one by id
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;

  let found = data.find((x) => x.id == id);
  if (!found) {
    return res.sendStatus(410);
  }

  let remain = data.filter((x) => x.id != id);

  write(fileName, remain)
    .then(() => {
      data = remain;
      return res.send();
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
});

// Get one by id
router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const body = req.body;

  let found = data.find((x) => x.id == id);

  if (!found) {
    return res.sendStatus(410);
  }

  // update dynamic depend body properties
  for (const key in body) {
    found[key] = body[key];
  }

  write(fileName, data)
    .then(() => {
      return res.send();
    })
    .catch((err) => {
      return res.sendStatus(500);
    });

  return res.send();
});

module.exports = router;

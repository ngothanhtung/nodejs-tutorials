var express = require('express');
var router = express.Router();
var data = require('../data/categories.json');

var { write } = require('../helpers/fileHelper');

const fileName = './data/categories.json';

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

  data.push(body);

  write(fileName, data);
  res.send();
});

// Get one by id
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;

  let found = data.find((x) => x.id == id);
  if (!found) {
    return res.sendStatus(410);
  }

  let remain = data.filter((x) => x.id != id);

  write(fileName, remain);

  return res.send();
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

  write(fileName, data);

  return res.send();
});

module.exports = router;

var express = require('express');
var router = express.Router();

let data = [
  { id: 1, name: 'iPhone 14 Pro Max', price: 1500 },
  { id: 2, name: 'iPhone 13 Pro Max', price: 1200 },
  { id: 10, name: 'iPhone 12 Pro Max', price: 1000 },
  { id: 4, name: 'iPhone 11 Pro Max', price: 800 },
  { id: 9, name: 'iPhone X', price: 500 },
];
// Methods: POST / PATCH / GET / DELETE / PUT

// Get all
router.get('/', function (req, res, next) {
  res.send(data);
});

// Create new data
router.post('/', function (req, res, next) {
  const newItem = req.body;

  // Get max id
  let max = 0;
  data.forEach((item) => {
    if (max < item.id) {
      max = item.id;
    }
  });

  newItem.id = max + 1;

  data.push(newItem);

  res.send({ ok: true, message: 'Created' });
});

// Delete data
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);

  res.send({ ok: true, message: 'Deleted' });
});

router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const patchData = req.body;

  let found = data.find((x) => x.id == id);

  if (found) {
    for (let propertyName in patchData) {
      found[propertyName] = patchData[propertyName];
    }
  }

  res.send({ ok: true, message: 'Updated' });
});

router.get('/search', function (req, res, next) {
  res.send('This is search router of products');
});

router.get('/details', function (req, res, next) {
  res.send('This is details router of products');
});

module.exports = router;

var express = require('express');
var router = express.Router();

let data = [
  { id: 1, name: 'Thời trang' },
  { id: 2, name: 'Điện máy' },
  { id: 3, name: 'Máy tính' },
  { id: 4, name: 'Old Category' },
];

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(data);
});

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  console.log(req.params.id);
  if (req.params.id === 'search') {
    next();
    return;
  }
  const id = parseInt();

  const found = data.find((x) => {
    return x.id === id;
  });

  if (found) {
    res.send(found);
    return;
  }
  // console.log('id: ', id);

  res.status(404).send({ message: 'Category not found' });
});

/* GET users listing. */

router.post('/', function (req, res, next) {
  const newCategory = req.body;
  data.push(newCategory);
  res.status(201).send({ message: 'Inserted' });
});

// querystring
router.get('/search', function (req, res, next) {
  const text = req.query.text;
  const price = req.query.price;
  console.log('text: ', text);
  console.log('price: ', price);
  res.send('OK');
});

router.patch('/:id', function (req, res, next) {
  const { id } = req.params;
  const { name, price } = req.body;

  let found = data.find((x) => {
    return x.id === parseInt(id);
  });

  found.name = name;
  found.price = price;

  res.send({ message: 'Updated' });
});

// DELETE
router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  data = data.filter((x) => x.id !== parseInt(id));

  console.log(id);
  res.send({ message: 'Deleted' });
});

module.exports = router;

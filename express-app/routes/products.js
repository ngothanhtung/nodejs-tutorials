var express = require('express');
var router = express.Router();

// ALL
// router.all('/', (req, res, next) => {
//   console.log('Accessing the secret section ...');
//   next(); // pass control to the next handler
// });

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json([{ id: 1, name: 'iPhone' }]);
});

router.get('/type', function (req, res, next) {
  res.send('type');
});

router.get('/kind', function (req, res, next) {
  res.send('kind');
});

// GET WITH PARAMS
router.get('/search/:name/type/:type', (req, res) => {
  const name = req.params.name;
  const type = req.params.type;
  console.log('Params: ', req.params);
  const price = req.query.price;
  console.log(price);
  res.send('ab?cd');
});

// POST
router.post('/', function (req, res, next) {
  const result = [
    {
      id: 1,
      name: 'iPhone 13',
    },
    {
      id: 2,
      name: 'iPhone 11',
    },
  ];
  res.jsonp({ user: 'tobi' });
  // res.json(result);
});

// POST
router.post('/search', function (req, res, next) {
  const data = req.body;
  console.log(data);
  // Code here ....
  const result = [];
  res.json(result);
});

// DOWNLOAD
router.get('/download', function (req, res, next) {
  // res.send('OK');
  res.download('public/images/nature.jpeg');
});

module.exports = router;

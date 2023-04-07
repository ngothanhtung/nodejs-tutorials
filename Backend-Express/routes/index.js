var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/send', function (req, res, next) {
  res.send({ message: 'Hello' });
});

router.get('/sendStatus', function (req, res, next) {
  res.sendStatus(201);
});

// Thường dùng
router.get('/setStatus', function (req, res, next) {
  res.status(201).json({ message: 'Hello' });
});

router.get('/file/download', (req, res, next) => {
  res.download('public/files/poster.png');
});

router.get('/sendFile', (req, res, next) => {
  res.sendFile('/public/files/poster.png', { root: './' });
});

// Thường dùng (status = 200)
router.get('/json', (req, res, next) => {
  res.json({ message: 'Hello Redirect' });
});

router.get('/redirect', (req, res, next) => {
  res.redirect('/json');
});

module.exports = router;

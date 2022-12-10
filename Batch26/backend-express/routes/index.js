var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function (req, res, next) {
  res.send('About');
});

router.get('/file/download', (req, res, next) => {
  res.download('public/files/poster.png');
});

router.get('/sendFile', (req, res, next) => {
  res.sendFile('/public/files/poster.png', { root: './' });
});

router.get('/json', (req, res, next) => {
  res.json({ message: 'Hello' });
});

router.get('/redirect', (req, res, next) => {
  res.redirect('/json');
});

module.exports = router;

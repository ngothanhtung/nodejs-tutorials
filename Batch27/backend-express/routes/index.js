var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/send', async (req, res, next) => {
  res.send({ message: 'Hello' });
});

router.get('/sendStatus', async (req, res, next) => {
  res.sendStatus(201);
});

// Thường dùng
router.get('/setStatus', async (req, res, next) => {
  res.status(201).json({ message: 'Hello' });
});

router.get('/file/download', async (req, res, next) => {
  res.download('public/files/poster.png');
});

router.get('/sendFile', async (req, res, next) => {
  res.sendFile('/public/files/poster.png', { root: './' });
});

// Thường dùng (status = 200)
router.get('/json', async (req, res, next) => {
  res.json({ message: 'Hello Redirect' });
});

router.get('/redirect', async (req, res, next) => {
  res.redirect('/json');
});

module.exports = router;

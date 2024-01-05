var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    message: 'Users',
  });
});

router.post('/login', function (req, res, next) {
  // Get method of request
  console.log(req.method);
  const { username, password } = req.body;
  // const username = req.body.username;
  // const password = req.body.password;

  if (username === 'admin' && password === '123') {
    return res.status(200).send({
      message: 'Login success',
    });
  }

  return res.status(401).send({
    message: 'Login failed',
  });
});

router.post('/register', function (req, res, next) {
  const { username, password, dob } = req.body;

  try {
    let date = new Date(dob);
    if (date == 'Invalid Date') {
      throw new Error('Invalid date');
    }
  } catch (error) {
    return res.status(500).send();
  }

  res.status(201).send({
    message: 'Register success',
  });
});

// check method not allowed
router.all('/login', function (req, res, next) {
  res.status(405).send({
    message: 'Method not allowed',
  });
});

module.exports = router;

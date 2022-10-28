var express = require('express');
var router = express.Router();

// req: request
router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log('* username: ', username);
  console.log('* password: ', password);
  if (username === 'admin' && password === '123456789') {
    res.send({ message: 'Login success!' });
    return;
  }

  res.status(401).send({ message: 'Login failed!' });
});

module.exports = router;

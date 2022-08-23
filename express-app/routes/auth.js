var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  if (username === 'tungnt@softech.vn' && password === '123456789') {
    res.json({
      user: {
        id: 1,
        email: 'tungnt@softech.vn',
        username: 'tungnt',
        firstName: 'Tony',
        lastName: 'Woo',
        isActive: true,
      },
      access_token: '...',
    });
    return;
  }

  res.status(401).json({
    statusCode: 401,
    message: 'Unauthorized',
  });
});

module.exports = router;

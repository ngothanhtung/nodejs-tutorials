var express = require('express');
var router = express.Router();

const users = [
  {
    username: 'tungnt@softech.vn',
    email: 'tungnt@softech.vn',
    password: '123456789',
    firstName: 'Tony',
    lastName: 'Woo',
    isActive: true,
  },
  {
    username: 'khanhnn@softech.vn',
    email: 'khanhnn@softech.vn',
    password: '123456789',
    firstName: 'Ngô',
    lastName: 'Khanh',
    isActive: true,
  },
];

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;

  try {
    const found = users.find((user) => {
      return user.username === username && user.password === password;
    });

    if (found) {
      res.json({
        user: found,
        access_token: '...',
      });
      return;
    } else {
      res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
      });
      return;
    }
  } catch (error) {
    res.sendStatus(500);
    return;
  }
});

module.exports = router;

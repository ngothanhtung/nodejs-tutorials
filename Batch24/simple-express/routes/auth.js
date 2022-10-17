var express = require('express');
var router = express.Router();

var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../constants/jwtSettings');

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  if (username === 'tungnt@softech.vn' && password === '123456789') {
    // login: OK
    // jwt
    var payload = {
      user: {
        username: username,
        fullName: 'End User',
      },
      application: 'ecommerce',
    };

    var secret = jwtSettings.SECRET;
    var token = jwt.sign(payload, secret, {
      expiresIn: 86400, // expires in 24 hours (24 x 60 x 60)
      audience: jwtSettings.AUDIENCE,
      issuer: jwtSettings.ISSUER,
      subject: username, // Thường dùng để kiểm tra JWT lần sau
      algorithm: 'HS512',
    });

    res.status(200).json({
      ok: true,
      login: true,
      token: token,
    });
    return;
  }

  res.status(401).json({
    statusCode: 401,
    message: 'Unauthorized',
  });
});

// setup jwt middleware
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.json({ ok: true });
});

// setup jwt middleware
// router.get('/', function (req, res, next) {
//   res.json({ ok: true });
// });
module.exports = router;

// VALIDATE
// 1. install: yup
// 2. config: schema
// 3. config middleware for route
// JWT:
// 1. install: jsonwebtoken, passport, passport-jwt
// 2. app:
// 3. route: login => token
// 4. config middleware for route
var express = require('express');
var router = express.Router();
var { validateSchema, loginSchema } = require('./schemas.yup');
var passport = require('passport');
var jwt = require('jsonwebtoken');

router.post('/login', validateSchema(loginSchema), function (req, res, next) {
  const { username, password } = req.body;
  if (username === 'tungnt@softech.vn' && password === '123456789') {
    // jwt
    var payload = {
      user: {
        username: username,
        email: 'tungnt@softech.vn',
      },
      application: 'ecommerce',
    };

    var secret = 'ADB57C459465E3ED43C6C6231E3C9';
    var token = jwt.sign(payload, secret, {
      expiresIn: 86400, // expires in 24 hours
      audience: 'softech.cloud',
      issuer: 'softech.cloud',
      subject: username,
      algorithm: 'HS512',
    });

    res.status(200).json({
      ok: true,
      login: true,
      user: {
        username: username,
        fullname: 'Ngo Thanh Tung',
      },
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

module.exports = router;

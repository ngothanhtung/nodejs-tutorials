var express = require('express');
var router = express.Router();

var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../constants/jwtSettings');

const yup = require('yup');
var { validateSchema } = require('../validations/validateSchema');

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(3).max(31).required(),
  }),
});

router.post('/login', validateSchema(loginSchema), function (req, res, next) {
  const { email, password } = req.body;

  if (email === 'tungnt@softech.vn' && password === '123456789') {
    res.send({ ok: true });
  }

  res.status(401).send({ ok: false });
});

router.post('/login-jwt', validateSchema(loginSchema), function (req, res, next) {
  const { email, password } = req.body;

  if (email === 'tungnt@softech.vn' && password === '123456789') {
    // Cấp JWT
    // login: OK
    // jwt
    var payload = {
      user: {
        email: email,
        fullName: 'End User',
      },
      application: 'ecommerce',
    };

    var secret = jwtSettings.SECRET;
    var token = jwt.sign(payload, secret, {
      expiresIn: 24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
      audience: jwtSettings.AUDIENCE,
      issuer: jwtSettings.ISSUER,
      subject: email, // Thường dùng để kiểm tra JWT lần sau
      algorithm: 'HS512',
    });

    res.send({ ok: true, token: token });
  }

  res.status(401).send({ ok: false });
});

// ROUTER WITHIN JWT
router.get('/jwt', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.send({ ok: true });
});

router.get('/jwt1', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.send({ ok: true });
});

module.exports = router;

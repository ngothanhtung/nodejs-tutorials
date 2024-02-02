const express = require('express');
var passport = require('passport');
const router = express.Router();
const { validateSchema } = require('../validations/validateSchema');
const { loginSchema, registerSchema } = require('../validations/schemas.yup');

router.post('/login', validateSchema(loginSchema), function (req, res, next) {
  const { username, password } = req.body;
  console.log(username, password);

  if (username === 'tungnt@softech.vn' && password === '123456789') {
    return res.send({ ok: true });
  }

  return res.status(401).send({ ok: false });
});

router.post('/register', validateSchema(registerSchema), function (req, res, next) {
  const { username, password, name } = req.body;

  //  Code ...
  return res.status(200).send({ ok: true });
});

// ------------------------------------------------------------------------------------------------
// CALL API HTTP BASIC AUTHENTICATION
// ------------------------------------------------------------------------------------------------
router.get('/basic', passport.authenticate('basic', { session: false }), function (req, res, next) {
  res.json({ ok: true });
});

module.exports = router;

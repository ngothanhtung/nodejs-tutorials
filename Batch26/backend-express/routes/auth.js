var express = require('express');
var router = express.Router();
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

module.exports = router;

const express = require('express');
const router = express.Router();
const { validateSchema } = require('../validations/validateSchema');
const { loginSchema, registerSchema } = require('../validations/schemas.yup');

var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../constants/jwtSettings');

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

// ------------------------------------------------------------------------------------------------
// LOGIN WITH JWT
// ------------------------------------------------------------------------------------------------
router.post('/jwt', async (req, res, next) => {
  const { username, password } = req.body;

  if (username === 'tungnt@softech.vn' && password === '123456789') {
    // TODO: DATABASE
    // 5-7 dòng
    // Cấp JWT
    const payload = {
      message: 'Hello JWT',
      id: username,
      roles: ['administrators', 'managers'],
    };

    const secret = jwtSettings.SECRET;

    // ACCESS TOKEN
    const token = jwt.sign(payload, secret, {
      expiresIn: 24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
      audience: jwtSettings.AUDIENCE,
      issuer: jwtSettings.ISSUER,
      subject: username, // Thường dùng để kiểm tra JWT lần sau
      algorithm: 'HS512',
    });

    // REFRESH TOKEN
    const refreshToken = jwt.sign({ username }, secret, { expiresIn: '365d' });

    return res.send({ message: 'Login success!', token, refreshToken });
  }

  res.status(401).send({ message: 'Login failed!' });
});

// ------------------------------------------------------------------------------------------------
// REFRESH TOKEN
// ------------------------------------------------------------------------------------------------
router.post('/refresh-token', async (req, res, next) => {
  const { refreshToken } = req.body;
  jwt.verify(refreshToken, jwtSettings.SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'refreshToken is invalid' });
    } else {
      console.log('🍎 decoded', decoded);
      const { username } = decoded;

      if (username === 'tungnt@softech.vn') {
        const secret = jwtSettings.SECRET;

        const payload = {
          message: 'Hello JWT',
          id: username,
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: 24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
          audience: jwtSettings.AUDIENCE,
          issuer: jwtSettings.ISSUER,
          subject: username, // Thường dùng để kiểm tra JWT lần sau
          algorithm: 'HS512',
        });

        return res.json({ token });
      }
      return res.sendStatus(401);
    }
  });
});

router.get('/jwt', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.json({ ok: true });
});

// CHECK ROLES : MIDLEWARE
// Call allowRoles ('admin', 'user', 'managers')
const allowRoles = (...required_roles) => {
  // return a middleware
  return (request, response, next) => {
    // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get('Authorization').replace('Bearer ', '');

    // DECODE TOKEN
    const payload = jwt.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
    const { sub, roles } = payload;

    // CHECK ROLES
    let ok = false;
    roles.forEach((role) => {
      if (required_roles.includes(role)) {
        ok = true;
        return;
      }
    });

    if (ok === true) {
      next();
    } else {
      response.status(403).json({ message: 'Forbidden' }); // user is forbidden
    }
  };
};

// ------------------------------------------------------------------------------------------------
// CALL API JWT AUTHENTICATION & CHECK ROLES
// ------------------------------------------------------------------------------------------------
router.get('/roles', passport.authenticate('jwt', { session: false }), allowRoles('supervisors', 'administrators'), function (req, res, next) {
  res.json({ ok: true });
});

module.exports = router;

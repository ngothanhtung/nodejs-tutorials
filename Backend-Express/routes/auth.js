var express = require('express');
var router = express.Router();

const { findDocuments, findDocument } = require('../helpers/MongoDbHelper');

const { Login } = require('../models');

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

// ------------------------------------------------------------------------------------------------
// LOGIN (WITH DUMMIES DATA)
// ------------------------------------------------------------------------------------------------
router.post('/login', validateSchema(loginSchema), function (req, res, next) {
  const { email, password } = req.body;

  if (email === 'tungnt@softech.vn' && password === '123456789') {
    res.send({ ok: true, name: 'Ngô Thanh Tùng', email, phone: '0905157803' });
  }

  res.status(401).send({ ok: false });
});

// ------------------------------------------------------------------------------------------------
// LOGIN (WITH MONGODB)
// ------------------------------------------------------------------------------------------------
router.post('/login-db', async (req, res, next) => {
  const { username, password } = req.body;

  const found = await Login.findOne({
    username,
    password,
  });

  if (found) {
    return res.status(200).send({ ok: true, loggedInUser: found });
  }

  return res.status(401).send({ ok: false });
});

// ------------------------------------------------------------------------------------------------
// LOGIN WITH JWT + REFRESH TOKEN
// ------------------------------------------------------------------------------------------------
router.post('/login-jwt', async (req, res, next) => {
  const { username, password } = req.body;

  const found = await Login.findOne({
    username,
    password,
  });

  if (found) {
    const id = found._id.toString();
    // Cấp token
    // jwt
    const payload = {
      message: 'payload',
    };

    const secret = jwtSettings.SECRET;

    // ACCESS TOKEN
    const token = jwt.sign(payload, secret, {
      expiresIn: 24 * 60 * 60, //24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
      audience: jwtSettings.AUDIENCE,
      issuer: jwtSettings.ISSUER,
      subject: id, // Thường dùng để kiểm tra JWT lần sau
      algorithm: 'HS512',
    });

    // REFRESH TOKEN
    const refreshToken = jwt.sign(
      {
        id,
      },
      secret,
      {
        expiresIn: '365d', // expires in 24 hours (24 x 60 x 60)
      },
    );
    res.send({ message: 'Login success!', loggedInUser: found, token, refreshToken });
    return;
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
      // console.log('🍎 decoded', decoded);
      const { id } = decoded;

      const user = await Login.findById(id);

      if (user) {
        console.log(user);
        const secret = jwtSettings.SECRET;

        const payload = {
          message: 'payload',
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: 10, //24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
          audience: jwtSettings.AUDIENCE,
          issuer: jwtSettings.ISSUER,
          subject: id, // Thường dùng để kiểm tra JWT lần sau
          algorithm: 'HS512',
        });

        return res.json({ token });
      }
      return res.sendStatus(401);
    }
  });
});

router.get('/authentication', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.send('OK');
});

// ------------------------------------------------------------------------------------------------
// CALL API HTTP BASIC AUTHENTICATION
// ------------------------------------------------------------------------------------------------
router.get('/basic', passport.authenticate('basic', { session: false }), function (req, res, next) {
  res.json({ ok: true });
});

// ------------------------------------------------------------------------------------------------
// CALL API HTTP API-KEY AUTHENTICATION
// ------------------------------------------------------------------------------------------------
const checkApiKey = () => {
  // return a middleware
  return (req, res, next) => {
    const apiKey = req.get('x-api-key');
    if (apiKey === '147258369') {
      next();
    } else {
      res.status(401).json({ message: 'x-api-key is invalid' });
    }
  };
};

router.get('/api-key', checkApiKey(), function (req, res, next) {
  res.json({ ok: true });
});

// CHECK ROLES
const allowRoles = (...roles) => {
  // return a middleware
  return (request, response, next) => {
    // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get('Authorization').replace('Bearer ', '');

    // DECODE TOKEN
    const payload = jwt.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
    const { sub } = payload;

    // FING BY _id
    findDocument(sub, 'login')
      .then((user) => {
        if (user && user.roles) {
          let ok = false;
          user.roles.forEach((role) => {
            if (roles.includes(role)) {
              ok = true;
              return;
            }
          });
          if (ok) {
            next();
          } else {
            response.status(403).json({ message: 'Forbidden' }); // user is forbidden
          }
        } else {
          response.status(403).json({ message: 'Forbidden' }); // user is forbidden
        }
      })
      .catch(() => {
        response.sendStatus(500);
      });
  };
};

// ------------------------------------------------------------------------------------------------
// CALL API JWT AUTHENTICATION & CHECK ROLES
// ------------------------------------------------------------------------------------------------
router.get('/roles', passport.authenticate('jwt', { session: false }), allowRoles('managers', 'supervisors'), function (req, res, next) {
  res.json({ ok: true });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var { validateSchema, loginSchema } = require('./schemas.yup');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../constants/jwtSettings');
const { findDocuments, findDocument } = require('../helpers/MongoDbHelper');

router.post('/login', validateSchema(loginSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const login = await findDocuments({ query: { username, password }, projection: { _id: 1, username: 1 } }, 'login');
    if (login.length > 0) {
      // jwt
      var payload = {
        uid: login[0]._id,
        email: login[0].username,
      };

      var token = jwt.sign(payload, jwtSettings.SECRET, {
        expiresIn: 86400, // expires in 24 hours
        issuer: jwtSettings.ISSUER,
        audience: jwtSettings.AUDIENCE,
        algorithm: 'HS512',
      });

      res.status(200).json({
        ok: true,
        login: true,
        payload,
        token: token,
      });
      return;
    }

    res.status(401).json({
      message: 'Unauthorized',
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

// ------------------------------------------------------------------------------------------------
// CALL API HTTP BASIC AUTHENTICATION
// ------------------------------------------------------------------------------------------------
router.get('/basic', passport.authenticate('basic', { session: false }), function (req, res, next) {
  res.json({ ok: true });
});

// ------------------------------------------------------------------------------------------------
// CALL API JWT AUTHENTICATION
// ------------------------------------------------------------------------------------------------
router.get('/jwt', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.json({ ok: true });
});

// ------------------------------------------------------------------------------------------------
// GET ALL USERS WITH API-KEY
// ------------------------------------------------------------------------------------------------

const checkApiKey = () => {
  // return a middleware
  return (request, response, next) => {
    const apiKey = request.get('x-api-key');
    if (apiKey === '147258369') {
      next();
    } else {
      response.status(401).json({ message: 'x-api-key is invalid' });
    }
  };
};

// Cách 1:
router.get('/api-key', checkApiKey(), function (req, res, next) {
  res.json({ ok: true });
});

// Cách 2
// router.use(checkApiKey());
// router.get('/api-key', function (req, res, next) {
//   res.json({ ok: true });
// });

// ------------------------------------------------------------------------------------------------
// CALL API WITH ROLES
// ------------------------------------------------------------------------------------------------

// CHECK ROLES
const allowRoles = (...roles) => {
  // return a middleware
  return (request, response, next) => {
    // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get('Authorization').replace('Bearer ', '');

    // DECODE TOKEN
    const payload = jwt.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
    const { uid } = payload;

    // FING BY _id
    findDocument(uid, 'login')
      .then((user) => {
        console.log(user);
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
router.get('/roles', passport.authenticate('jwt', { session: false }), allowRoles('administrators'), function (req, res, next) {
  res.json({ ok: true });
});

module.exports = router;

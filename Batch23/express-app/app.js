const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var jwt = require('jsonwebtoken');
const passport = require('passport');

var BasicStrategy = require('passport-http').BasicStrategy;

const jwtSettings = require('./constants/jwtSettings');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const suppliersRouter = require('./routes/suppliers');
const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const ordersRouter = require('./routes/orders');
const blogsRouter = require('./routes/blogs');
const uploadRouter = require('./routes/upload');

// QUIZ
const questionsRouter = require('./routes/questions');
const { findDocuments, findDocument } = require('./helpers/MongoDbHelper');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(
  cors({
    origin: '*',
  }),
);

// Passport: Basic Auth
passport.use(
  new BasicStrategy(function (username, password, done) {
    console.log('\n🚀 BasicStrategy 🚀\n');
    findDocuments({ query: { username: username, password: password } }, 'login')
      .then((result) => {
        if (result.length > 0) {
          return done(null, true);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  }),
);

// Passport: Bearer Token
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.issuer = jwtSettings.ISSUER;
opts.audience = jwtSettings.AUDIENCE;

passport.use(
  new JwtStrategy(opts, function (payload, done) {
    console.log('\n🚀 JwtStrategy 🚀\n');
    const _id = payload.uid;
    findDocument(_id, 'login')
      .then((result) => {
        if (result) {
          return done(null, result);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  }),
);

// END: PASSPORT

// app.use();

// app.use(myLogger);

// ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/orders', ordersRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);

// MONGOOSE
app.use('/blogs', blogsRouter);
app.use('/questions', questionsRouter);

// UPLOAD
app.use('/upload', uploadRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

// MIDDLEWARE
// const myLogger = function (req, res, next) {
//   console.log(req.headers['api-key']);

//   const apiKey = req.headers['api-key'];
//   if (apiKey && apiKey === 'aptech-node-key') {
//     next();
//   } else {
//     res.sendStatus(401);
//   }
//   console.log('MIDDLEWARE LOGGED');
// };

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ error: err.message });
});

module.exports = app;

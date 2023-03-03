var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const passport = require('passport');

var BasicStrategy = require('passport-http').BasicStrategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSettings = require('./constants/jwtSettings');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var categoriesRouter = require('./routes/categories');
var suppliersRouter = require('./routes/suppliers');
var customersRouter = require('./routes/customers');
var employeesRouter = require('./routes/employees');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var uploadRouter = require('./routes/upload');
var questionsRouter = require('./routes/questions');

const { findDocument, findDocuments } = require('./helpers/MongoDbHelper');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: '*',
  }),
);

// const myLogger = function (req, res, next) {
//   console.log('LOGGED');
//   next();
// };

// app.use(myLogger);

// Passport: Basic Auth
passport.use(
  new BasicStrategy(function (username, password, done) {
    console.log('🚀 BasicStrategy');
    // MONGODB
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

// Passport: jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.audience = jwtSettings.AUDIENCE;
opts.issuer = jwtSettings.ISSUER;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    const id = payload.sub;
    // console.log(payload);
    const found = await findDocument(id, 'login');
    // console.log('🐣', found);

    if (found && found.active) {
      let error = null;
      let user = true;
      return done(error, user);
    } else {
      let error = null;
      let user = false;
      return done(error, user);
    }
  }),
);

app.use('/', indexRouter);

app.use('/categories', categoriesRouter);

app.use('/suppliers', suppliersRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);

app.use('/auth', authRouter);

app.use('/upload', uploadRouter);
app.use('/questions', questionsRouter);

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
  res.render('error');
});

module.exports = app;

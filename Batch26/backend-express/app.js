var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// JWT
const passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSettings = require('./constants/jwtSettings');

const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var suppliersRouter = require('./routes/suppliers');
var productsRouter = require('./routes/products');
var employeesRouter = require('./routes/employees');
var customersRouter = require('./routes/customers');
var ordersRouter = require('./routes/orders');
var mwRouter = require('./routes/mw');
var authRouter = require('./routes/auth');

var uploadRouter = require('./routes/upload');

const { findDocuments } = require('./helpers/MongoDbHelper');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MONGOOSE

const { CONNECTION_STRING } = require('./constants/dbSettings');
const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_STRING);

// Add CORS here
app.use(
  cors({
    origin: '*',
  }),
);

const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

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

// jwt
// Passport: jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.audience = jwtSettings.AUDIENCE;
opts.issuer = jwtSettings.ISSUER;

passport.use(
  new JwtStrategy(opts, function (payload, done) {
    console.log('payload', payload);
    let error = null;
    let user = true;
    return done(error, user);
  }),
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/categories', categoriesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/products', productsRouter);
app.use('/employees', employeesRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/mw', mwRouter);
app.use('/auth', authRouter);

app.use('/upload', uploadRouter);

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

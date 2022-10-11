const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
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

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
// UPLOAD
app.use('/upload', uploadRouter);

// MIDDLEWARE
const myLogger = function (req, res, next) {
  console.log(req.headers['api-key']);

  const apiKey = req.headers['api-key'];
  if (apiKey && apiKey === 'aptech-node-key') {
    next();
  } else {
    res.sendStatus(401);
  }
  console.log('MIDDLEWARE LOGGED');
};

// Passport: jwt
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'ADB57C459465E3ED43C6C6231E3C9';
opts.issuer = 'softech.cloud';
opts.audience = 'softech.cloud';

passport.use(
  new JwtStrategy(opts, function (payload, done) {
    if (payload.sub === 'tungnt@softech.vn') {
      return done(null, true);
    } else {
      return done(null, false);
    }
  }),
);

// END: PASSPORT

// app.use(myLogger);

app.use('/products', productsRouter);
app.use('/auth', authRouter);

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

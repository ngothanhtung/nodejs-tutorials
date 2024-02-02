const { default: mongoose } = require('mongoose');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// AUTH WITH JWT

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSettings = require('./constants/jwtSettings');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const suppliersRouter = require('./routes/suppliers');
const productsRouter = require('./routes/products');
const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const ordersRouter = require('./routes/orders');
const httpResponsesRouter = require('./routes/http-responses');

const authRouter = require('./routes/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Cors

// Add CORS here
app.use(
  cors({
    origin: '*',
  }),
);

// Passport: Basic Auth
passport.use(
  new BasicStrategy(async (username, password, done) => {
    console.log('🚀 BasicStrategy');

    if (username === 'aptech' && password === '147258369') {
      return done(null, true);
    } else {
      return done(null, false);
    }
  }),
);

// CONNECT TO MONGODB
// mongoose
//   .connect('mongodb://localhost:27017/online-shop')
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.log('Error connecting to MongoDB', error);
//   });

// Register routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/products', productsRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/orders', ordersRouter);
app.use('/http-responses', httpResponsesRouter);

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
  res.render('error');
});

module.exports = app;

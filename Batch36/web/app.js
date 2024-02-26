const { default: mongoose } = require('mongoose');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const passport = require('passport');

// HTTP BASIC AUTH
const BasicStrategy = require('passport-http').BasicStrategy;
// JWT
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// SETTINGS
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
const uploadRouter = require('./routes/upload');

const questionsRouter = require('./routes/questions');

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

// My Logger
const myLogger = async (req, res, next) => {
  console.log('LOGGED', req.body);
  next();
};

app.use(myLogger);

// Passport: Basic Auth
passport.use(
  new BasicStrategy(async (username, password, done) => {
    console.log('🚀 BasicStrategy');

    // hard code
    if (username === 'aptech' && password === '147258369') {
      let error = null;
      let user = true;
      return done(error, user); // => next()
    } else {
      let error = null;
      let user = false;
      return done(error, user); // res.sendStatus(401)
    }
  }),
);

// Passport: jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.audience = jwtSettings.AUDIENCE;
opts.issuer = jwtSettings.ISSUER;

passport.use(
  new JwtStrategy(opts, function (payload, done) {
    console.log(payload);
    if (['tungnt@softech.vn', 'peter@gmail.com'].includes(payload.sub)) {
      let error = null;
      let user = true;
      return done(error, user); // => next()
    } else {
      let error = null;
      let user = false;
      return done(error, user); //
    }
  }),
);

// CONNECT TO MONGODB
mongoose
  .connect('mongodb://localhost:27017/online-shop')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error);
  });

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

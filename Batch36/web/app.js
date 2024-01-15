const { default: mongoose } = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var suppliersRouter = require('./routes/suppliers');
var productsRouter = require('./routes/products');
var customersRouter = require('./routes/customers');
var employeesRouter = require('./routes/employees');
var ordersRouter = require('./routes/orders');
var httpResponsesRouter = require('./routes/http-responses');

var app = express();

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
    // methods: 'GET,POST,PUT,DELETE',
    // allowedHeaders: 'Content-Type,Authorization',
  }),
);

//
mongoose.connect('mongodb://localhost:27017/online-shop');

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

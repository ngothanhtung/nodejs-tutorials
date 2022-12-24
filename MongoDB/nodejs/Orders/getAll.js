// https://stackoverflow.com/questions/10729276/how-can-i-get-the-full-object-in-node-jss-console-log-rather-than-object
const util = require('util');
const { default: mongoose } = require('mongoose');

const { Order } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://127.0.0.1:27017/training-database');

try {
  Order.find({})
    .populate('customer')
    .populate('employee')
    .then((result) => {
      // alternative shortcut
      console.log(util.inspect(result, false, null, true /* enable colors */));
      // console.log(result);
    });
} catch (err) {
  console.log(err);
}

const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/training-database');

try {
  Category.find().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

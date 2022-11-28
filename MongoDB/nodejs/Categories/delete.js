const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://127.0.0.1:27017/training-database');

try {
  const id = '6362647d5ff5a41f96d24df6';

  Category.findByIdAndDelete(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

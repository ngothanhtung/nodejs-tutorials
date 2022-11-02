const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/Test');

try {
  const id = '6362647d5ff5a41f96d24df6';

  Category.findByIdAndDelete(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

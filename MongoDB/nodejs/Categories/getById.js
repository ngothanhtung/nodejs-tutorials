const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-training');

try {
  const id = '636263af9766a403ebf7328c';
  Category.findById(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

const { default: mongoose } = require('mongoose');

const { Product } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/training-database');

try {
  Product.find({ price: 100 })
    .limit(1)
    .populate('category')
    .then((result) => {
      console.log(result);
    });
} catch (err) {
  console.log(err);
}

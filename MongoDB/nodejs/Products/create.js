const { default: mongoose } = require('mongoose');

const { Product } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/training-database');

try {
  const data = {
    name: 'Quần Jean',
    price: 100,
    categoryId: '6364bba3efe5791187600234',
    discount: 10,
  };

  const newItem = new Product(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

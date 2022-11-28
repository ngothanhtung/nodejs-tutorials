const { default: mongoose } = require('mongoose');

const { Product } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://127.0.0.1:27017/training-database');

try {
  const data = {
    name: 'Áo sơ mi',
    price: 200,
    stock: 100,
    discount: 0,
    categoryId: '6364f9f30486025f375b5942',
  };

  const newItem = new Product(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

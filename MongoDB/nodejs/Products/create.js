const { default: mongoose } = require('mongoose');

const { Product } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-training');

try {
  const data = {
    name: 'iPhone 15',
    price: -1,
    categoryId: '63293fea50d2f78624e0c6f3',
  };

  const newItem = new Product(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

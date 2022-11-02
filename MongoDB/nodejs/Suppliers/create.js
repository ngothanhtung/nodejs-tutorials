const { default: mongoose } = require('mongoose');

const { Supplier } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-training');

try {
  const data = {
    name: 'Apple',
    email: 'tungntsoftech.vn',
  };

  const newItem = new Supplier(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

const { default: mongoose } = require('mongoose');
const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/training-database');

try {
  const data = {
    name: 'Thời trang',
    description: 'Mô tả ...',
  };

  const newItem = new Category(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

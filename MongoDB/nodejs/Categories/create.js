const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-training');

try {
  const data = {
    name: 'Tên danh mục',
    description: 'Mô tả ...',
  };

  const newItem = new Category(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

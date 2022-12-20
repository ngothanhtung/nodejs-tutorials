const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://127.0.0.1:27017/training-database');

try {
  const id = '63623f180b99f96759d9cc30';
  const data = { name: 'New Name' };
  Category.findByIdAndUpdate(id, data, {
    new: true,
  }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

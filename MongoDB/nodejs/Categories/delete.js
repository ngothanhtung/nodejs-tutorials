const { default: mongoose } = require('mongoose');

const { Category } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-training');

try {
  const id = '63623f180b99f96759d9cc30';

  Category.findByIdAndDelete(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

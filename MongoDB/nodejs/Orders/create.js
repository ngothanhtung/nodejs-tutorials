const { default: mongoose } = require('mongoose');

const { Order } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-training');

try {
  const data = {
    // paymentType: 'CREDIT CARD1',
    shippedDate: '2022-10-01',
  };

  const newItem = new Order(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

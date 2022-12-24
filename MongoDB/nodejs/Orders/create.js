const { default: mongoose } = require('mongoose');

const { Order } = require('../models');
// MONGOOSE
mongoose.connect('mongodb://127.0.0.1:27017/api-training');

try {
  const data = {
    status: 'WAITING',
    paymentType: 'CREDIT CARD',
    customerId: '636b8cf8d9e31cc53c50223a',
    empployeeId: '636b8d18d9e31cc53c50223c',
    orderDetails: [
      {
        productId: '6364f4ba71a2bec066e4352f',
        quantity: 1,
        price: 100000,
        discount: 10,
      },
      {
        productId: '6364fbbfeac7fb67de0dbf1b',
        quantity: 1,
        price: 5000000,
        discount: 0,
      },
    ],
  };

  const newItem = new Order(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

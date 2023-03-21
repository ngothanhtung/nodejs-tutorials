const { Product } = require('../models');
// MONGOOSE
const { default: mongoose } = require('mongoose');
mongoose.connect('mongodb://root:HBkb2012@192.168.72.222:27017/training-database?authSource=admin&authMechanism=SCRAM-SHA-256&readPreference=primary&ssl=false&directConnection=true');

Product.aggregate([{ $lookup: { from: 'orders', localField: '_id', foreignField: 'orderDetails.productId', as: 'orders' } }, { $match: { orders: { $size: 0 } } }]).exec((err, results) => {
  if (err) {
    console.log(err);
  } else {
    console.log(results);
  }
});

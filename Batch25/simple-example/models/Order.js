const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const orderSchema = new Schema({
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },

  shippedDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value) return true;

        if (value < this.createdDate) {
          return false;
        }
        return true;
      },
      message: `Shipped date: {VALUE} is invalid!`,
    },
  },

  paymentType: {
    type: String,
    required: true,
    default: 'CASH',
    validate: {
      validator: (value) => {
        if (value !== 'CREDIT CARD' && value !== 'CASH') {
          return false;
        }
        return true;
      },
      message: `Payment type: {VALUE} is invalid!`,
    },
  },
});

const Order = model('Order', orderSchema);
module.exports = Order;

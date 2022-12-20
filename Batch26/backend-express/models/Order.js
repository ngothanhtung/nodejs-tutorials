const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const orderDetailSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, require: true, min: 0 },
  price: { type: Number, required: true, min: 0, default: 0 },
  discount: { type: Number, default: 0 },
});

// Virtual with Populate
orderDetailSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

// Virtuals in console.log()
orderDetailSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
orderDetailSchema.set('toJSON', { virtuals: true });

// ------------------------------------------------------------------------------------------------

const orderSchema = new Schema({
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
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
        if (['CASH', 'CREDIT CARD'].includes(value.toUpperCase())) {
          return true;
        }
        return false;
      },
      message: `Payment type: {VALUE} is invalid!`,
    },
  },

  status: {
    type: String,
    required: true,
    default: 'WAITING',
    validate: {
      validator: (value) => {
        if (['WAITING', 'COMPLETED', 'CANCELED'].includes(value)) {
          return true;
        }
        return false;
      },
      message: `Status: {VALUE} is invalid!`,
    },
  },

  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: false },

  // Array
  orderDetails: [orderDetailSchema],
});

// Virtual with Populate
orderSchema.virtual('customer', {
  ref: 'Customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
});

// Virtuals in console.log()
orderSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
orderSchema.set('toJSON', { virtuals: true });

const Order = model('Order', orderSchema);
module.exports = Order;

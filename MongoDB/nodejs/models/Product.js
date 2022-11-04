const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const yup = require('yup');

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const productSchema = Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, min: 0, max: 75, default: 0 },
    stock: {
      type: Number,
      validate: {
        validator: function (value) {
          console.log(value);
          yup
            .number()
            .min(0)
            .max(5)
            .validate(value)
            .then((result) => {
              return true;
              console.log('😍', result);
            })
            .catch((err) => {
              return false;
              console.error('🧨', err);
            });
        },
        message: `{VALUE} is invalid (YUP)`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: false },
  },
  {
    versionKey: false,
  },
);

// Virtuals
productSchema.virtual('total').get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

// Virtual with Populate
productSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Include virtuals

// Virtuals in console.log()
productSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
productSchema.set('toJSON', { virtuals: true });

const Product = model('Product', productSchema);
module.exports = Product;

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const productSchema = new Schema(
  {
    name: String,
    price: Number,
    discount: Number,
    stock: Number,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  },
  {
    // QUERY
    query: {
      byName(name) {
        return this.where({ name: new RegExp(name, 'i') });
      },
    },
    // VIRTUALS
    virtuals: {
      total: {
        get() {
          return (this.price * (100 - this.discount)) / 100;
        },
      },
    },
  },
);
// Include virtuals
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

// validateBeforeSave
productSchema.set('validateBeforeSave', true);

const Product = model('Product', productSchema);

module.exports = Product;

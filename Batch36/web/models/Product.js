const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, min: 0, max: 90, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    imageUrl: { type: String, required: false },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  },
  {
    versionKey: false,
  },
);

// BEGIN VIRTUAL
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

productSchema.virtual('supplier', {
  ref: 'Supplier',
  localField: 'supplierId',
  foreignField: '_id',
  justOne: true,
});

// SETTING VIRTUALS

// Virtuals in object
productSchema.set('toObject', { virtuals: true });

// Virtuals in console.log()
productSchema.set('toObject', { virtuals: true });

// apply plugin
productSchema.plugin(mongooseLeanVirtuals);
// END VIRTUAL

const Product = model('Product', productSchema);
module.exports = Product;

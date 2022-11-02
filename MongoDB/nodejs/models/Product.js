const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: [0, 'Must be at least 0, got {VALUE}'] },
  discount: { type: Number, min: 0, max: 100, required: false },
  stock: { type: Number, min: 0, required: false },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
});

const Product = model('Product', productSchema);

module.exports = Product;

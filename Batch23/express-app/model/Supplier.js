const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const supplierSchema = new Schema({
  title: String,
  description: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

const Supplier = model('Supplier', supplierSchema);

module.exports = Supplier;

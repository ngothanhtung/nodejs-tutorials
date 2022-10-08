const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  description: String,
});

const Category = model('Category', categorySchema);

module.exports = Category;

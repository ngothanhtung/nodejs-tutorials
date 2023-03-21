const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Mongoose Datatype:
// https://mongoosejs.com/docs/schematypes.html
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  {
    versionKey: false,
  },
);

const Category = model('Category', categorySchema);

module.exports = Category;

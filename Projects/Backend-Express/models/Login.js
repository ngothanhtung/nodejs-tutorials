const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const loginSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

const Login = model('Login', loginSchema);
module.exports = Login;

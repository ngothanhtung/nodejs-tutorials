const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const questionSchema = new Schema({
  title: String,
  score: Number,
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
});

const Question = model('Question', questionSchema);

module.exports = Question;

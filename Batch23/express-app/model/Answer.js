const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const answerSchema = new Schema({
  username: String,
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  score: Number,
});

const Answer = model('Answer', answerSchema);

module.exports = Answer;

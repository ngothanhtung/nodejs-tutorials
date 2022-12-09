var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var { Question, Answer } = require('../models');

mongoose.connect('mongodb://127.0.0.1:27017/training-database');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const questions = await Question.find({});
  res.send(questions);
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    // Validate (data)
    const question = new Question(data);
    await question.save();
    res.json({ question });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/answer', async (req, res, next) => {
  try {
    const data = req.body;
    // Validate (data)
    const answer = new Answer(data);
    await answer.save();
    res.json({ answer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

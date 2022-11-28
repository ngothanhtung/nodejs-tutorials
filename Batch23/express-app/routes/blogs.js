var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = require('../model/Blog');

mongoose.connect('mongodb://127.0.0.1:27017/api-training');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const blogs = await Blog.find({});
  res.send(blogs);
});

router.post('/', async (req, res, next) => {
  try {
    // Create a new blog post object
    const article = new Blog({
      title: 'Awesome Post!',
      slug: 'awesome-post',
      published: true,
      content: 'This is the best post ever',
      tags: ['featured', 'announcement'],
      likes: -1,
    });

    let error = await article.validateSync();
    console.warn(error);
    // if (!error) {
    //   res.status(400).json({ error: err.message });
    // }

    // Insert the article in our MongoDB database
    await article.save();
    res.render('index', { title: 'Express 123456', subTitle: 'Aptech' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;

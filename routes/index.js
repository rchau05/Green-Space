var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

// Including Mongoose
var mongoose = require('mongoose');
require('../models/Posts');
require('../models/Comments');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// Getting posts
router.get('/posts', function (req, res, next) {
  Post.find(function(err, posts) {
    if(err) {
      alert('Can\'t get posts.')
      return next(err);
    }
    res.json(posts);
  });
});

// Posting to mongoose database
router.post('/posts', function (req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err) {
      alert('Unable to post')
      return next(err);
    }
    res.json(post)
  });
});


module.exports = router;

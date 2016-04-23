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

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if(err) {
      alert('Can\'t find by ID')
      return next(err);
    } else if (!post) {
      return next(new Error('can\'t find post'));
    }
    req.post = post;
    return next();
  });
});

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

// Getting a single post
router.get('/posts/:post', function(req,res, next) {
  req.post.populate('comments', function(err, posts) {
    if(err) {
      alert('Cannot populate')
      return next(err)
    };
    res.json(post)
  })
  res.json(req.post);
});

// Posting a post
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

// posting comments to a particular post
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req,body);
  comment.post = req.post;

  comment.save(function(err, comment) {
    if(err) {
      alert('Unable to save comment')
      return next(err);
    }
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err) {
        alert("Unable to save post comments")
        return next(err);
      }
      res.json(comment);
    });
  });
});

// Changing the amount of upvotes
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if(err) {
      alert('unable to upvote')
      return next(err)
    }
    res.json(post);
  });
});

// Changing the amount of comment of post upvotes
// router.put('/posts/:post/comments/:comment/upvote' function(req, res, next) {
//   req.post.comment.upvote
// })

module.exports = router;

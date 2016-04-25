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
      console.log('Error: ',err)
      return next(err);
    } 
    if (!post) {
      return next(new Error('can\'t find post'));
    }
    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment) {
    if(err) {
      console.log('Error: ',err)
      return next(err);
    } 
    if (!comment) {
      return next(new Error('can\'t find comment'));
    }
    req.comment = comment;
    return next();
  });
});

// Getting posts
router.get('/posts', function (req, res, next) {
  Post.find(function(err, posts) {
    if(err) {
      console.log('Can\'t get posts.')
      return next(err);
    }
    res.json(posts);
  });
});

// Getting a single post
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if(err) {
      console.log('Error: ', err)
      return next(err)
    };
    res.json(post)
  })
});

// Getting a single comment
router.get('/posts/:post/comments/:comment', function(req, res, next) {
  if(err) {
    console.log('Error: ', err)
    return next(err)
  };
  res.json(comment)
});

// Posting a post
router.post('/posts', function (req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err) {
      console.log('Unable to post')
      return next(err);
    }
    res.json(post)
  });
});

// posting comments to a particular post
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment) {
    if(err) {
      console.log('Unable to save', err)
      return next(err);
    }
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err) {
        console.log("Unable to save post comments")
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
      console.log('unable to upvote posts', err)
      return next(err)
    }
    res.json(post);
  });
});

// Changing the amount of comment of post upvotes
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment) {
    if(err) {
      console.log('unable to upvote comment', err)
      return next(err) 
    }
    res.json(comment)
  })
})

module.exports = router;

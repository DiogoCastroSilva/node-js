// Express
const express = require('express');

// Controllers
const feedController = require('../controllers/feed');

// Creating Routes
const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// Post
router.post('/post', feedController.createPost);

module.exports = router;
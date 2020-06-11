// Packages
const express = require('express');
const { body } = require('express-validator');

// Controllers
const feedController = require('../controllers/feed');

// Creating Routes
const router = express.Router();

// GET /feed/posts
router.get('/posts',feedController.getPosts);
router.get('/post/:id', feedController.getPost);

// Post
router.post('/post', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], feedController.createPost);

// PUT - Update
router.put('/post/:id',[
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 }),
], feedController.updatePost);

// DELETE
router.delete('/post/:id', feedController.deletePost);


module.exports = router;
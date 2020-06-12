// Packages
const express = require('express');
const { body } = require('express-validator');

// Controllers
const feedController = require('../controllers/feed');
// Middlewares
const isAuth = require('../middleware/is-auth');

// Creating Routes
const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);
router.get('/post/:id', isAuth, feedController.getPost);

// Post
router.post(
    '/post',
    isAuth, [
        body('title')
            .trim()
            .isLength({ min: 5 }),
        body('content')
            .trim()
            .isLength({ min: 5 })
    ],
    feedController.createPost
);

// PUT - Update
router.put(
    '/post/:id',
    isAuth, [
        body('title')
            .trim()
            .isLength({ min: 5 }),
        body('content')
            .trim()
            .isLength({ min: 5 }),
    ],
    feedController.updatePost
);

// DELETE
router.delete('/post/:id', isAuth, feedController.deletePost);


module.exports = router;
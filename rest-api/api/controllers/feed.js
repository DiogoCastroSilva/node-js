const { validationResult } = require('express-validator');

// Models
const Post = require('../models/post');

// GET
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: new Date().toISOString(),
                title: 'First Post',
                content: 'This is the first post',
                imageUrl: 'images/bride-duck',
                creator: {
                    name: 'Diogo'
                },
                createdAt: new Date()
            }
        ]
    });
};

exports.getPost = (req, res, next) => {
    const id = req.params.id;

    Post
        .findById(id)
        .then(post => {
            if (!post) {
                const error = new Error('Could not found post');
                error.statusCode = 404;
                // cath will use next
                throw error;
            }

            res
                .status(200)
                .json({
                    message: 'Post fetched',
                    post: post
                });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e)
        });
};

// POST
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/bride-duck',
        creator: {
            name: 'Diogo'
        }
    });

    post
        .save()
        .then(result => {
            res.status(201).json({
                message: 'The post was created successfully',
                post: result
            });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e)
        });
};
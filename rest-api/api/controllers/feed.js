const { validationResult } = require('express-validator');

// Models
const Post = require('../models/post');

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
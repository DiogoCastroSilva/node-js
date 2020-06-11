// Core
const fs = require('fs');
const path = require('path');

// Packages
const { validationResult } = require('express-validator');

// Models
const Post = require('../models/post');

// GET
exports.getPosts = (req, res, next) => {
    const page = req.query.page || 1;
    console.log('page query', page);
    const perPage = 2;
    let totalItems;
    Post.countDocuments()
        .then(numberOfDocs => {
            totalItems = numberOfDocs;
            return Post.find()
                .skip((page - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200)
                .json({
                    message: 'Fetched posts successfully',
                    posts: posts,
                    totalItems: totalItems
                });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);
        });
};

exports.getPost = (req, res, next) => {
    const id = req.params.id;

    Post.findById(id)
        .then(post => {
            if (!post) {
                const error = new Error('Could not found post');
                error.statusCode = 404;
                // cath will use next
                throw error;
            }

            res.status(200)
                .json({
                    message: 'Post fetched',
                    post: post
                });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);
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

    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: {
            name: 'Diogo'
        }
    });

    post.save()
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
            next(e);
        });
};

// PUT
exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;
    }

    const id = req.params.id;

    Post.findById(id)
        .then(post => {
            if (!post) {
                const error = new Error('Could not found post');
                error.statusCode = 404;
                throw error;
            }

            // Delete old image
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = req.body.title;
            post.content = req.body.content;
            post.imageUrl = imageUrl;

            return post.save();
        })
        .then(response => {
            res.status(200).json({
                message: 'Post updated',
                post: response
            });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);
        });
};

// DELETE
exports.deletePost = (req, res, next) => {
    const id = req.params.id;
    Post.findById(id)
        .then(post => {
            if (!post) {
                const error = new Error('Could not found post');
                error.statusCode = 404;
                throw error;
            }
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(id);
        })
        .then(() => {
            res.status(200).json({
                message: 'Deleted Post'
            });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);
        });
};


// Util
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, e => {
        if (e) {
            console.log('Error deleting image file', e)
        }
    });
};
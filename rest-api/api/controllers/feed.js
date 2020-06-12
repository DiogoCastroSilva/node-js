// Core
const fs = require('fs');
const path = require('path');

// Packages
const { validationResult } = require('express-validator');

// Models
const Post = require('../models/post');
const User = require('../models/user');

// GET
exports.getPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find()
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200)
            .json({
                message: 'Fetched posts successfully',
                posts: posts,
                totalItems: totalItems
            });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};

exports.getPost = async (req, res, next) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id);
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
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};

// POST
exports.createPost = async (req, res, next) => {
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
        creator: req.userId
    });

    try {
        await post.save()
        const user = await User.findById(req.userId);
        user.posts.push(post);
        await user.save();
        res.status(201).json({
            message: 'The post was created successfully',
            post: post,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};

// PUT
exports.updatePost = async (req, res, next) => {
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
    try {
        const post = await Post.findById(id);
        if (!post) {
            const error = new Error('Could not found post');
            error.statusCode = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }

        // Delete old image
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }

        post.title = req.body.title;
        post.content = req.body.content;
        post.imageUrl = imageUrl;

        const response = await post.save();
        res.status(200).json({
            message: 'Post updated',
            post: response
        });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};

// DELETE
exports.deletePost = async (req, res, next) => {
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        if (!post) {
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }

        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(id);
        const user = await User.findById(req.userId);
        user.posts.pull(id);
        await user.save();
        res.status(200).json({
            message: 'Deleted Post'
        });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
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
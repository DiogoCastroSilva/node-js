// Packages
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/user');


// GET
exports.getStatus = async (req, res, next) => {
    try {
        const user = User.findById(req.userId);
        if (!user) {
            const error = new Error('Failed to get user');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({
            status: user.status
        });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};

// POST
exports.login = async (req, res, next) => {
    const email = req.body.email;

    try {
        const userDoc = await User.findOne({ email: email })
        if (!userDoc) {
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(req.body.password, userDoc.password);
        if (!isEqual) {
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: userDoc.email,
                id: userDoc._id.toString()
            },
            'somesupersecrettoken',
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            token: token,
            id: userDoc._id.toString()
        });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};

// PUT
exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const password = req.body.password;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const email = req.body.email;
        const name = req.body.name;

        const user = new User({
            email: email,
            name: name,
            password: hashedPassword
        });

        const result = await user.save();

        res.status(201).json({
            message: 'User created!',
            id: result._id
        });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};

// PATCH
exports.updateStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {
        const user =await User.findById(req.userId);
        if (!user) {
            const error = new Error('Failed to get user');
            error.statusCode = 401;
            throw error;
        }

        user.status = req.body.status;
        const result = await user.save();
        res.status(201).json({
            message: 'User status updated!',
            id: result._id
        });
    } catch(e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};
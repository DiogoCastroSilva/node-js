// Packages
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/user');


// GET
exports.getStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('Failed to get user');
                error.statusCode = 401;
                throw error;
            }
            res.status(200).json({
                status: user.status
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
exports.login = (req, res, next) => {
    const email = req.body.email;

    let user;
    User.findOne({ email: email })
        .then(userDoc => {
            if (!userDoc) {
                const error = new Error('A user with this email could not be found');
                error.statusCode = 401;
                throw error;
            }
            user = userDoc;
            const password = req.body.password;

            return bcrypt.compare(password, userDoc.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign(
                {
                    email: user.email,
                    id: user._id.toString()
                },
                'somesupersecrettoken',
                {
                    expiresIn: '1h'
                }
            );

            res.status(200).json({
                token: token,
                id: user._id.toString()
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
exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const email = req.body.email;
            const name = req.body.name;

            const user = new User({
                email: email,
                name: name,
                password: hashedPassword
            });

            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User created!',
                id: result._id
            });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);
        });
};

// PATCH
exports.updateStatus = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('Failed to get user');
                error.statusCode = 401;
                throw error;
            }

            user.status = req.body.status;
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User status updated!',
                id: result._id
            });
        })
        .catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);
        });
};
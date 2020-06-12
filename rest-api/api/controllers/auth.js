// Packages
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/user');

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
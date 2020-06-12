// Packages
const express = require('express');
const { body } = require('express-validator');


// Controllers
const authController = require('../controllers/auth');
// Models
const User = require('../models/user');

const router = express.Router();

// PUT
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('E-mail address alredy exists');
                    }
                });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup);


module.exports = router;
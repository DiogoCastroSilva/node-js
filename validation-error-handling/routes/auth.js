// Express
const express = require('express');
// Validator
const { check, body } = require('express-validator');

// Controllers
const authController = require('../controllers/auth');
// Models
const User = require('../models/user');

const router = express.Router();

// GET
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/new-password/:token', authController.getNewPassword);

// POST
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isAlphanumeric().isLength({ min: 5 })
            .withMessage('Enter a valid password that is 5 characters long and as numbers and text'),
    ],
    authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, {req}) => {
                // Exemple of a custom validation
                // if (value === 'test@test.com') {
                //     throw new Error('This email address is forbiden');
                // }
                // return true;
                User.findOne({email: value})
                    .then(user => {
                        if (user) {
                            return Promise.reject('Email alredy exists, login or pick a new one');
                        }
                    })
            }),
        body(
            'password',
            'Please enter a valid password, with at least 5 characters, with numbers and text!'
        )
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
    ],
    authController.postSignup
);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
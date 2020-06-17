// Packages
const express = require('express');
const { body } = require('express-validator');


// Controllers
const authController = require('../controllers/auth');
// Models
const User = require('../models/user');
// Middleware
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET
router.get('/status', isAuth, authController.getStatus);

// POST
router.post('/login', authController.login);

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

// PATCH
router.patch(
    '/status', [
        body('status')
            .trim()
            .not()
            .isEmpty()
    ],
    isAuth,
    authController.updateStatus
);



module.exports = router;
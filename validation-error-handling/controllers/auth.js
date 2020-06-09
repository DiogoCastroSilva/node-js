// Core
const crypto = require('crypto');

// Bcrypt
const bcrypt = require('bcryptjs');
// Nodemailer
const nodemailer = require('nodemailer');
// SendGrid
const sendGridTransport = require('nodemailer-sendgrid-transport');
// Validator
const { validationResult } = require('express-validator');

// Models
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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',
    }
}));

// GET
exports.getLogin = (req, res) => {
    // Cookie
    // const isLoggedIn = req
    //     .get('Cokkie')
    //     .split(';')[1]
    //     .trim()
    //     .split('=')[1];

    // let messages = req.flash('error');
    // if (messages.length > 0) {
    //     messages = messages[0];
    // } else {
    //     messages = null;
    // }
    res.render('auth/login', {
        path: '/login',
        title: 'Login',
        docTitle: 'Login',
        errorMessage: null,
        errors: null
    });
};

exports.getSignup = (req, res) => {
    // let messages = req.flash('error');
    // if (messages.length > 0) {
    //     messages = messages[0];
    // } else {
    //     messages = null;
    // }

    res.render('auth/signup', {
        path: '/signup',
        title: 'Signup',
        docTitle: 'Signup',
        errorMessage: null,
        errors: null
    });
};

exports.getReset = (req, res) => {
    // let messages = req.flash('error');
    // if (messages.length > 0) {
    //     messages = messages[0];
    // } else {
    //     messages = null;
    // }

    res.render('auth/reset', {
        path: '/reset',
        title: 'Reset',
        docTitle: 'Reset',
        errorMessage: null,
        error: null
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    })
    .then(user => {
        if (!user) {
            return res.redirect('/');
        }
        res.render('auth/new-password', {
            path: '/new-password',
            title: 'New Password',
            docTitle: 'New Password',
            userId: user._id.toString(),
            passwordToken: token
        });
    })
    .catch(e => {
        const error = new Error('Getting new Password error: ' + e);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// POST
exports.postLogin = (req, res, next) => {
    // Cookie
    // req.setHeader('Set-Cookie', 'isLogedIn=true');
    // if (!req.body.email) {
    //     req.flash('error', 'Fields missing');
    //     return res.redirect('/login');
    // };
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            title: 'Login',
            docTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            errors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email');
                return res.redirect('auth/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        // Session
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid password');
                    res.redirect('auth/login');
                })
                .catch(e => {
                    const error = new Error('Error comparing password: ' + e);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .catch(e => {
            const error = new Error('Error finding user: ' + e);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            title: 'Signup',
            docTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword 
            },
            errors: errors.array()
        });
    }

    return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const newUser = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] }
                });
                return newUser.save();
            })
            .then(() => {
                res.redirect('/login');
                return transporter.sendMail({
                    to: email,
                    from: 'email',
                    subject: 'Welcome to Shop',
                    html: '<h1>You successfuly signed up!</h1>'
                });
            }).catch(e => {
                const error = new Error('Error while signing up: ' + e);
                error.httpStatusCode = 500;
                return next(error);
            });;
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log('Error creating crypto', error);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');

        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with this email found');
                    return res.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            }).then(() => {
                res.redirect('/');
                try {
                    transporter.sendMail({
                        to: req.body.email,
                        from: 'email',
                        subject: 'Password reset',
                        html: `
                            <p>You requested a password reset</p>
                            <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set new password</p>
                        `
                    });
                } catch(e) {
                    console.log(e);
                }
            })
            .cart(e => {
                const error = new Error('Error while signing up: ' + e);
                error.httpStatusCode = 500;
                return next(error);
            });
    });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    User.findById(userId)
        .where({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() }
        })
        .then(user => {
            if (!user) {
                return;
            }

            return bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    return user.save();
                });
        })
        .then(() => {
            res.redirect('/login');
            
        })
        .catch(e => {
            const error = new Error('Error saving new passwrod: ' + e);
            error.httpStatusCode = 500;
            return next(error);
        });
}

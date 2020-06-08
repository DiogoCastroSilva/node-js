// Bcrypt
const bcrypt = require('bcryptjs');

const User = require('../models/user');

// GET
exports.getLogin = (req, res) => {
    // Cookie
    // const isLoggedIn = req
    //     .get('Cokkie')
    //     .split(';')[1]
    //     .trim()
    //     .split('=')[1];

    let messages = req.flash('error');
    if (messages.length > 0) {
        messages = messages[0];
    } else {
        messages = null;
    }
    res.render('auth/login', {
        path: '/login',
        title: 'Login',
        docTitle: 'Login',
        errorMessage: messages
    });
};

exports.getSignup = (req, res) => {
    let messages = req.flash('error');
    if (messages.length > 0) {
        messages = messages[0];
    } else {
        messages = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        title: 'Signup',
        docTitle: 'Signup',
        errorMessage: messages
    });
};

// POST
exports.postLogin = (req, res) => {
    // Cookie
    // req.setHeader('Set-Cookie', 'isLogedIn=true');
    if (!req.body.email) {
        req.flash('error', 'Fields missing');
        return res.redirect('/login');
    };
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email');
                return res.redirect('/login');
            }
            bcrypt.compare(req.body.password, user.password)
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
                    res.redirect('/login');
                })
                .catch(e => {
                    console.log('Error comparing password', e);
                });
        })
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.postSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
        .then(user => {
            if (user) {
                req.flash('error', 'Email alredy exists, login or pick a new one');
                return res.redirect('/signup');
            }

            return bcrypt.hash(password, 12)
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
                });;
        });
};

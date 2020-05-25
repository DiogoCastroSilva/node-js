// Express
const express = require('express');

const router = express.Router();

const users = [];

router.get('/users', (req, res) => {
    res.render('users', {
        path: '/users',
        title: 'Users',
        users: users
    });
});

router.post('/users', (req, res) => {
    console.log(req.body.name);
    users.push({ name: req.body.name });
    res.redirect('/users');
});

module.exports = {
    router: router,
    users: users
};
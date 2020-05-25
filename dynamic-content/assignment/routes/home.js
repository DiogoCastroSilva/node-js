// Express
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        path: '/',
        title: 'Home'
    });
});

module.exports = router;
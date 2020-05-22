// Path
const path = require('path');

// Express
const express = require('express');

// Util
const rootDir = require('../util/path');

const router = express.Router();

router.get('/add-product', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res) => {
    console.log('Product middleware!');
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
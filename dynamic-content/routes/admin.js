// Path
const path = require('path');

// Express
const express = require('express');

// Util
const rootDir = require('../util/path');

const router = express.Router();
const products = [];

router.get('/add-product', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

module.exports = {
    routes: router,
    products: products
};
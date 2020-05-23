// Path
const path = require('path');

// Express
const express = require('express');

// Util
const rootDir = require('../util/path');

const router = express.Router();
const products = [];

router.get('/add-product', (req, res) => {
    res.render('add-product', { title: 'Add Product', path: '/admin/add-product' });
});

router.post('/add-product', (req, res) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

module.exports = {
    routes: router,
    products: products
};
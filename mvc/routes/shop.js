// Path
const path = require('path');
// Express
const express = require('express');

// Util
const rootDir = require('../util/path');
// Routes
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;
    // res.render('shop', { title: 'Shop', products, docTitle: 'Shop', path: '/' });
    res.render('shop', {
        title: 'Shop',
        products,
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;
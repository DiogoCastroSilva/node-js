// Products Model
const Product = require('../models/product');


// GET
exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            title: 'All Products',
            products,
            docTitle: 'All Products',
            path: '/products',
        });
    });
};

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            title: 'Shop',
            products,
            docTitle: 'Shop',
            path: '/',
        });
    });
};

exports.getCart = (req, res) => {
    res.render('shop/cart', {
        title: 'Your Cart',
        docTitle: 'Cart',
        path: '/cart'
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        title: 'Your Orders',
        docTitle: 'Orders',
        path: '/orders'
    });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        docTitle: 'Checkout',
        path: '/checkout'
    });
};

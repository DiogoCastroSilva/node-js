// Products Model
const Product = require('../models/product');
const Cart = require('../models/cart');


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

exports.getProduct = (req, res) => {
    const id = req.params.id;
    Product.findById(id, product => {
        res.render('shop/product-detail', {
            title: product.title,
            product,
            docTitle: product.title,
            path: '/product-detail'
        });
    });

};

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            title: 'Shop',
            products,
            docTitle: 'Shop',
            path: null,
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

// POST
exports.addToCart = (req, res) => {
    const id = req.body.id;
    Product.findById(id, product => {
        Cart.addProduct(id, product.price);
    });
    res.redirect('/cart');
};

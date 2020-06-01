// Products Model MYSQL Sequelize
const Product = require('../models/product');
const Cart = require('../models/cart');


// GET
exports.getProducts = (req, res) => {
    // MYSQL
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', {
            title: 'All Products',
            products,
            docTitle: 'All Products',
            path: '/products',
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res) => {
    const id = req.params.id;
    Product.findByPk(id).then(product => {
        console.log(product);
        res.render('shop/product-detail', {
            title: product.title,
            product: product,
            docTitle: product.title,
            path: '/product-detail'
        });
    });

};

exports.getIndex = (req, res) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            title: 'Shop',
            products: products,
            docTitle: 'Shop',
            path: null,
        });
    });
};

exports.getCart = (req, res) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (const product of products) {
                const cartProduct = cart.products.find(prod => prod.id === product.id);
                if (cartProduct) {
                    cartProducts.push({ product: product, qty: cartProduct.qty });
                }
            }
            res.render('shop/cart', {
                title: 'Your Cart',
                docTitle: 'Cart',
                path: '/cart',
                products: cartProducts
            });
        });
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

exports.postDeleteProduct = (req, res) => {
    const id = req.body.id;
    Product.findById(id, product => {
        Cart.removeProduct(id, product.price);
        res.redirect('/cart');
    });
};

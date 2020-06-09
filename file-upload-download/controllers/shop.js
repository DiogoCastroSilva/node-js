// Core
const fs = require('fs');
const path = require('path');

// Models
const Product = require('../models/product');
const Order = require('../models/order');


// Mongoose
// GET
exports.getProducts = (req, res) => {
    // MYSQL
    Product.find().then(products => {
        res.render('shop/product-list', {
            title: 'All Products',
            products: products,
            docTitle: 'All Products',
            path: '/products'
        });
    });
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id).then(product => {
        res.render('shop/product-detail', {
            title: product.title,
            docTitle: product.title,
            path: '/product-detail',
            product: product
        });
    })
    .catch(e => {
        const error = new Error('Error getting product: ' + e);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/index', {
            title: 'Shop',
            docTitle: 'Shop',
            products: products,
            path: null
            // isAuthenticated: req.session.isLoggedIn,
            // csrfToken: req.csrfToken()
        });
    })
    .catch(e => {
        const error = new Error('Error getting product: ' + e);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            res.render('shop/cart', {
                title: 'Your Cart',
                docTitle: 'Cart',
                path: '/cart',
                products: user.cart.items
            });
        })
        .catch(e => {
            const error = new Error('Error getting cart products: ' + e);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Your Orders',
                docTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(e => {
            const error = new Error('Error getting orders: ' + e);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.id;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('Order not found'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unautorized'));
            }

            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     // Opens the pdf instead of downloading it
            //     res.setHeader('Content-type', 'application/pdf');
            //     res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);
            //     res.send(data);
            // });

            const file = fs.createReadStream(invoicePath);
            // Opens the pdf instead of downloading it
            res.setHeader('Content-type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
            file.pipe(res);
        })
        .catch(e => {
            return next(e);
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
exports.addToCart = (req, res, next) => {
    const id = req.body.id;
    Product.findById(id).then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log('Add to cart', result);
        res.redirect('/cart');
    })
    .catch(e => {
        const error = new Error('Error adding to cart: ' + e);
        error.httpStatusCode = 500;
        return next(error);
    });;
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.id;

    req.user.removeFromCart(id).then(() => {
        res.redirect('/cart');
    })
    .catch(e => {
        const error = new Error('Error deleting product: ' + e);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.addOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(item => ({
                    quantity: item.quantity,
                    product: {
                        ...item.productId._doc
                    }
            }));
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user._id
                },
                products: products
            });

            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(e => {
            const error = new Error('Error adding order: ' + e);
            error.httpStatusCode = 500;
            return next(error);
        });
};

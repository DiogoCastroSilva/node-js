// Core
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_test_51GsQlAAxJTVl3mJatcoewZOZQOZM5o3BtAd1x1ouSdCG2OvUFKDC7P3EimQpZEL4L4gpbwBUon2xExwEOiJ3rrSY001cQzhUO2');

// PDF Kit
const PDFDocument = require('pdfkit');

// Models
const Product = require('../models/product');
const Order = require('../models/order');

// Util
const pdfUtil = require('../util/pdf');

// Global Variables
const ITEMS_PER_PAGE = 2;

// Mongoose
// GET
exports.getProducts = (req, res) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product
        .find()
        .countDocuments()
        .then(numberOfProducts => {
            totalItems = numberOfProducts;
            return Product.find()
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/product-list', {
                title: 'All Products',
                products: products,
                docTitle: 'All Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
    const page = +req.query.page || 1;
    let totalItems;
    Product
        .find()
        .countDocuments()
        .then(numberOfProducts => {
            totalItems = numberOfProducts;
            return Product.find()
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
        res.render('shop/index', {
            title: 'Shop',
            docTitle: 'Shop',
            products: products,
            path: null,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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

            // Send async to the browser
            // const file = fs.createReadStream(invoicePath);
            // // Opens the pdf instead of downloading it
            // res.setHeader('Content-type', 'application/pdf');
            // res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
            // file.pipe(res);

            res.setHeader('Content-type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
            // Create a PDF
            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            
            pdfUtil.generateHeader(pdfDoc);
            pdfUtil.generateUserData(pdfDoc, req.user.email);
            pdfUtil.generateTable(pdfDoc, order.products);

            pdfDoc.end();


        })
        .catch(e => {
            return next(e);
        });
};

exports.getCheckout = (req, res, next) => {
    let total = 0;
    let products;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            products = user.cart.items;
            user.cart.items.forEach(p => {
                total += p.quantity * p.productId.price;
            });
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: 'usd',
                        quantity: p.quantity
                    }
                }),
                mode: 'payment',
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            });
        })
        .then(session => {
            console.log('session', session);
            res.render('shop/checkout', {
                title: 'Checkout',
                docTitle: 'Checkout',
                path: '/checkout',
                products: products,
                totalSum: total,
                sessionId: session.id
            });
        })
        .catch(e => {
            const error = new Error('Error getting cart products: ' + e);
            error.httpStatusCode = 500;
            return next(error);
        });

    
};

exports.getCheckoutSuccess = (req, res, next) => {
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

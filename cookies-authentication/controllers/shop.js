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
            path: '/products',
        });
    });
};

exports.getProduct = (req, res) => {
    const id = req.params.id;
    Product.findById(id).then(product => {
        res.render('shop/product-detail', {
            title: product.title,
            docTitle: product.title,
            path: '/product-detail',
            product: product
        });
    });
};

exports.getIndex = (req, res) => {
    Product.find().then(products => {
        res.render('shop/index', {
            title: 'Shop',
            docTitle: 'Shop',
            products: products,
            path: null,
        });
    });
};

exports.getCart = (req, res) => {
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
        });
};

exports.getOrders = (req, res) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Your Orders',
                docTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
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
    Product.findById(id).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        console.log('Add to cart', result);
        res.redirect('/cart');
    });
};

exports.postDeleteProduct = (req, res) => {
    const id = req.body.id;

    req.user.removeFromCart(id).then(() => {
        res.redirect('/cart');
    });
};

exports.addOrder = (req, res) => {
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
                    name: req.user.name,
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
        });
};

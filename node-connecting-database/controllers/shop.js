const Product = require('../models/product');
const Order = require('../models/order');

// Products Model MYSQL Sequelize

// // GET
// exports.getProducts = (req, res) => {
//     // MYSQL
//     Product.findAll()
//     .then(products => {
//         res.render('shop/product-list', {
//             title: 'All Products',
//             products: products,
//             docTitle: 'All Products',
//             path: '/products',
//         });
//     }).catch(err => {
//         console.log(err);
//     });
// };

// exports.getProduct = (req, res) => {
//     const id = req.params.id;
//     Product.findByPk(id).then(product => {
//         console.log(product);
//         res.render('shop/product-detail', {
//             title: product.title,
//             product: product,
//             docTitle: product.title,
//             path: '/product-detail'
//         });
//     });

// };

// exports.getIndex = (req, res) => {
//     Product.findAll().then(products => {
//         res.render('shop/index', {
//             title: 'Shop',
//             products: products,
//             docTitle: 'Shop',
//             path: null,
//         });
//     });
// };

// exports.getCart = (req, res) => {

//     req.user.getCart()
//         .then(cart => {
//             return cart.getProducts();
//         })
//         .then(products => {
//             res.render('shop/cart', {
//                 title: 'Your Cart',
//                 docTitle: 'Cart',
//                 path: '/cart',
//                 products: products
//             });
//         });
// };

// exports.getOrders = (req, res, next) => {
//     req.user.getOrders({ include: ['products'] }).then(orders => {
//         res.render('shop/orders', {
//             title: 'Your Orders',
//             docTitle: 'Orders',
//             path: '/orders',
//             orders: orders
//         });
//     });
    
// };

// exports.getCheckout = (req, res) => {
//     res.render('shop/checkout', {
//         title: 'Checkout',
//         docTitle: 'Checkout',
//         path: '/checkout'
//     });
// };

// // POST
// exports.addToCart = (req, res) => {
//     const id = req.body.id;
//     let fetchedCart;
//     let newQuantity = 1;
//     req.user
//         .getCart().then(cart => {
//             fetchedCart = cart;
//             return cart.getProducts({ where: { id: id } } );
//         }).then(products => {
//             let product;
//             if (products.lenght > 0) {
//                 product = products[0];
//             }
//             if (product) {
//                 const oldQuantity = product.cartItem.quantity;
//                 newQuantity = oldQuantity + 1;
//                 return product;
//             }
//             return Product.findByPk(id);
//         }).then(product => {
//             return fetchedCart.addProduct(product, {
//                 through: { quantity: newQuantity }
//             });
//         }).then(() => {
//             res.redirect('/cart');
//         });
// };

// exports.postDeleteProduct = (req, res) => {
//     const id = req.body.id;
//     req.user.getCart().then(cart => {
//         return cart.getProducts({ where: { id: id } } );
//     }).then(products => {
//         const product = products[0];
//         product.cartItem.destroy();
//     }).then(() => {
//         res.redirect('/cart');
//     });
// };

// exports.addOrder = (req, res) => {
//     let fetchedCart;
//     req.user.getCart().then(cart => {
//         fetchedCart = cart;
//         return cart.getProducts();
//     }).then(products => {
//         return req.user.createOrder()
//             .then(order => {
//                 return order.addProducts(products.map(product => {
//                     product.orderItem = { quantity: productd.cartItem.quantity };
//                     return product;
//                 }));
//             });
//     }).then(() => {
//         return fetchedCart.setProducts(null);
        
//     }).then(() => {
//         res.redirect('/orders');
//     });
// };


// MONGO DB

// // GET
// exports.getProducts = (req, res) => {
//     // MYSQL
//     Product.find().then(products => {
//         res.render('shop/product-list', {
//             title: 'All Products',
//             products: products,
//             docTitle: 'All Products',
//             path: '/products',
//         });
//     });
// };

// exports.getProduct = (req, res) => {
//     const id = req.params.id;
//     Product.findById(id).then(product => {
//         res.render('shop/product-detail', {
//             title: product.title,
//             docTitle: product.title,
//             path: '/product-detail',
//             product: product
//         });
//     });
// };

// exports.getIndex = (req, res) => {
//     Product.find().then(products => {
//         res.render('shop/index', {
//             title: 'Shop',
//             docTitle: 'Shop',
//             products: products,
//             path: null,
//         });
//     });
// };

// exports.getCart = (req, res) => {
//     req.user.getCart().then(products => {
//         res.render('shop/cart', {
//             title: 'Your Cart',
//             docTitle: 'Cart',
//             path: '/cart',
//             products: products
//         });
//     });
// };

// exports.getOrders = (req, res) => {
//     req.user.getOrders()
//         .then(orders => {
//             res.render('shop/orders', {
//                 title: 'Your Orders',
//                 docTitle: 'Orders',
//                 path: '/orders',
//                 orders: orders
//             });
//         });
// };

// exports.getCheckout = (req, res) => {
//     res.render('shop/checkout', {
//         title: 'Checkout',
//         docTitle: 'Checkout',
//         path: '/checkout'
//     });
// };

// // POST
// exports.addToCart = (req, res) => {
//     const id = req.body.id;
//     Product.findById(id).then(product => {
//         return req.user.addToCart(product);
//     }).then(result => {
//         console.log('Add to cart', result);
//         res.redirect('/cart');
//     });
// };

// exports.postDeleteProduct = (req, res) => {
//     const id = req.body.id;

//     req.user.deleteItemFromCart(id).then(() => {
//         res.redirect('/cart');
//     });
// };

// exports.addOrder = (req, res) => {
//     req.user.addOrder().then(result => {
//         res.redirect('/orders');
//     });
// };

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

// Products Model
const Product = require('../models/product');

// SEQUELIZE

// // GET
// exports.getAddProduct = (req, res) => {
//     res.render('admin/edit-product', {
//         title: 'Add Product',
//         path: '/admin/add-product',
//         editing: false
//     });
// };

// exports.getEditProduct = (req, res) => {
//     const id = req.params.id;
//     req.user.getProducts({ where: { id: id } })
//         .then(products => {
//             const product = products[0];
//             if (!product) {
//                 res.redirect('/');
//             }

//             res.render('admin/edit-product', {
//                 title: 'Edit Product',
//                 path: '/admin/edit-product',
//                 editing: true,
//                 product: product
//             });
//         });
// };

// exports.getProducts = (req, res) => {
//     req.user.getProducts().then(products => {
//         res.render('admin/products', {
//             title: 'All Products',
//             products: products,
//             docTitle: 'Admin Products',
//             path: '/admin/products',
//         });
//     });
// };

// // POST
// exports.postAddProduct = (req, res) => {
//     const title = req.body.title;
//     const imageUrl = req.body.imageUrl;
//     const description = req.body.description;
//     const price = req.body.price;

//     req.user.createProduct({
//         title: title,
//         price: price,
//         imageUrl: imageUrl,
//         description: description
//     }).then(result => {
//         console.log('create product', result);
//         res.redirect('/');
//     });
// };

// exports.postEditProduct = (req, res) => {
//     const id = req.body.id;
//     Product.findByPk(id).then(product => {
//         product.title = req.body.title;
//         product.imageUrl = req.body.imageUrl;
//         product.description = req.body.description;
//         product.price = req.body.price;
//         return product.save();
//     }).then(() => {
//         res.redirect('/admin/products');
//     });
    
// };

// // DELETE
// exports.deleteProduct = (req, res) => {
//     const id = req.params.id;
//     Product.findByPk(id).then(product => {
//         return product.destroy();
//     }).then(() => {
//         res.redirect('/admin/products');
//     });
// };

// MONGO DB

// // GET
// exports.getAddProduct = (req, res) => {
//     res.render('admin/edit-product', {
//         title: 'Add Product',
//         path: '/admin/add-product',
//         editing: false
//     });
// };

// exports.getEditProduct = (req, res) => {
//     const id = req.params.id;

//     Product.getProduct(id).then(product => {
//         res.render('admin/edit-product', {
//             title: 'Edit Product',
//             path: '/admin/edit-product',
//             editing: true,
//             product: product
//         });
//     });
// };

// exports.getProducts = (req, res) => {
//     Product.fetchAll().then(products => {
//         res.render('admin/products', {
//             title: 'All Products',
//             docTitle: 'Admin Products',
//             path: '/admin/products',
//             products: products
//         });
//     });
// };

// // // POST
// exports.postAddProduct = (req, res) => {
//     const title = req.body.title;
//     const imageUrl = req.body.imageUrl;
//     const description = req.body.description;
//     const price = req.body.price;
// console.log(req.user);
//     const product = new Product(title, imageUrl, description, price, null, req.user._id);

//     product.save().then(() => {
//         res.redirect('/admin/products');
//     });
// };

// exports.postEditProduct = (req, res) => {
//     const id = req.body.id;
//     const title = req.body.title;
//     const imageUrl = req.body.imageUrl;
//     const description = req.body.description;
//     const price = req.body.price;

//     const newProduct = new Product(title, imageUrl, description, price, id, req.user._id);

//     newProduct.save().then(() => {
//         res.redirect('/admin/products');
//     });
// };

// // // DELETE
// exports.deleteProduct = (req, res) => {
//     const id = req.params.id;
//     Product.delete(id).then(() => {
//         res.redirect('/admin/products');
//     });
// };

// Mongoose

// GET
exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getEditProduct = (req, res) => {
    const id = req.params.id;

    Product.findById(id).then(product => {
        res.render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product: product
        });
    });
};

exports.getProducts = (req, res) => {
    Product.find().then(products => {
        res.render('admin/products', {
            title: 'All Products',
            docTitle: 'Admin Products',
            path: '/admin/products',
            products: products
        });
    });
};

// // POST
exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        userId: req.user._id
    });

    product.save().then(() => {
        res.redirect('/admin/products');
    });
};

exports.postEditProduct = (req, res) => {
    const id = req.body.id;
    Product.findById(id).then(product => {
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        product.price = req.body.price;

        product.save().then(() => {
            res.redirect('/admin/products');
        });
    })
    
};

// // DELETE
exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    Product
        .findById(id)
        .remove()
        .then(() => {
            res.redirect('/admin/products');
        });
};
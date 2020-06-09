// Validator
const { validationResult } = require('express-validator');

// Utils
const fileUtil = require('../util/file');

// Product Model
const Product = require('../models/product');


// Mongoose
// GET
exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: null,
        hasError: false
    });
};

exports.getEditProduct = (req, res, next) => {
    const id = req.params.id;

    Product.findById(id).then(product => {
        res.render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: false,
            errorMessage: null,
            product: product
        });
    }).catch(e => {
        const error = new Error('Getting Product error: ' + e);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id }).then(products => {
        res.render('admin/products', {
            title: 'All Products',
            docTitle: 'Admin Products',
            path: '/admin/products',
            products: products,
            hasError: false,
            errorMessage: null,
            errors: []
        });
    }).catch(e => {
        const error = new Error('Getting Products error: ' + e);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// // POST
exports.postAddProduct = (req, res, next) => {
    // Using muler file
    const image = req.file;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            title: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            errorMessage: 'Attached file is not an image',
            errors: [{ param: 'image'}],
            product: {
                title: title,
                description: description,
                price: price
            }
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            title: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            errors: errors.array(),
            product: {
                title: title,
                description: description,
                price: price
            }
        });
    }

    const product = new Product({
        title: title,
        imageUrl: image.path,
        description: description,
        price: price,
        userId: req.user._id
    });

    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(e => {
            // First Option
            // return res.status(500).render('admin/edit-product', {
            //     title: 'Add Product',
            //     path: '/admin/edit-product',
            //     editing: false,
            //     hasError: true,
            //     errorMessage: 'Database error',
            //     errors: null,
            //     product: {
            //         title: title,
            //         imageUrl: imageUrl,
            //         description: description,
            //         price: price
            //     }
            // });

            // Second Option
            // res.redirect('/500');

            // Best Option
            const error = new Error('Add Product error: ' + e);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            errors: errors.array(),
            product: {
                title: title,
                description: description,
                price: price,
                _id: id
            }
        });
    }

    Product.findById(id).then(product => {
        if (product.userId.toString() !== req.user._id.toString())
            return res.redirect('/');

        product.title = title;
        product.description = description;
        product.price = price;

        // Only save image if the value was changed
        if (image) {
            fileUtil.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }

        return product.save()
            .then(() => {
                res.redirect('/admin/products');
            })
            .catch(e => {
                const error = new Error('Edit Product error: ' + e);
                error.httpStatusCode = 500;
                return next(error);
            });
    })
    
};

// // DELETE
exports.deleteProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id).then(product => {
        if (!product) {
            return next(new Error('Product not found!'));
        }
        fileUtil.deleteFile(product.imageUrl);
        return Product
                    .deleteOne({ _id: id, userId: req.user._id });
    })
    .then(() => {
        res.status(200).json({
            message: 'Success'
        });
    })
    .catch(e => {
        res.status(500).json({
            message: 'Error'
        });
    });
};
// Products Model
const Product = require('../models/product');


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
    Product.findById(id, product => {
        if (!product) {
            res.redirect('/');
        }

        res.render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            title: 'All Products',
            products,
            docTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
};

// POST
exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

exports.postEditProduct = (req, res) => {
    const id = req.body.id
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageUrl, description, price, id);

    product.save();
    res.redirect('/admin/products');
};

// DELETE
exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    Product.delete(id);
    res.redirect('/admin/products');
};
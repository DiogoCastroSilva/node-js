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
    Product.findByPk(id).then(product => {
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
    Product.findAll().then(products => {
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

    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(result => {
        console.log('create product', result);
        res.redirect('/');
    });
};

exports.postEditProduct = (req, res) => {
    const id = req.body.id
    Product.findByPk(id).then(product => {
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        product.price = req.body.price;
        return product.save();
    }).then(() => {
        res.redirect('/admin/products');
    });
    
};

// DELETE
exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    Product.findByPk(id).then(product => {
        return product.destroy();
    }).then(() => {
        res.redirect('/admin/products');
    });
};
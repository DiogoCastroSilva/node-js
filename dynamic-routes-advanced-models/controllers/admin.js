// Products Model
const Product = require('../models/product');


// GET
exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formCSS: true,
        productCSS: true
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
// Products Model
const Product = require('../models/product');


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
    Product.find({ userId: req.user._id }).then(products => {
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
        if (product.userId.toString() !== req.user._id.toString())
            return res.redirect('/');

        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        product.price = req.body.price;

        return product.save().then(() => {
            res.redirect('/admin/products');
        });
    })
    
};

// // DELETE
exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    Product
        .deleteOne({ _id: id, userId: req.user._id })
        .then(() => {
            res.redirect('/admin/products');
        });
};
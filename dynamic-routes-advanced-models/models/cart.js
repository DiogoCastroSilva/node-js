// Core
const fs = require('fs');
const path = require('path');

const cardPath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, price) {
        // Fetch the previous cart
        fs.readFile(cardPath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err && fileContent) {
                cart = JSON.parse(fileContent);
            }

            // Find existing Product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;

            // Add new Product / Update price
            if (existingProduct) {
                updatedProduct = {
                    ...existingProduct,
                    qty: existingProduct.qty + 1
                };
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            // Update cart
            cart.totalPrice = cart.totalPrice + +price;
            fs.writeFile(cardPath, JSON.stringify(cart), err => {
                console.log('err', err);
            });
        });
    }

    static removeProduct (id, price) {
        fs.readFile(cardPath, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const productToDelete = updatedCart.products.find(prod => prod.id === id);
            if (!productToDelete) {
                return;
            }
            const prouctQty = productToDelete.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - prouctQty * price;
            fs.writeFile(cardPath, JSON.stringify(updatedCart), err => {
                console.log('err', err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(cardPath, (err, fileContent) => {
            if (err) {
                return cb(null);
            }
            return cb(JSON.parse(fileContent));
        });
    }
}
// Core
const fs = require('fs');
const path = require('path');

// Models
const Cart = require('./cart');


const pathToSave = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(pathToSave, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.id = id;
    }

    save() {
        getProductsFromFile(products => {
            const updatedProducts = [...products];
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                updatedProducts[existingProductIndex] = this;
            } else {
                this.id = Math.random().toString();
                updatedProducts.push(this);
            }
            fs.writeFile(pathToSave, JSON.stringify(updatedProducts), (err) => {
                console.log('err', err);
            });
        });
    }

    static delete(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(pathToSave, JSON.stringify(updatedProducts), (err) => {
                console.log('err', err);
                if (!err) {
                    Cart.removeProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        });
    }
};

// Models
const Cart = require('./cart');
// Database
const db = require('../util/database');


module.exports = class Product {
    constructor(title, imageUrl, description, price, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.id = id;
    }

    save() {
       return db.execute(
           'INSERT INTO Products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
           [this.title, this.price, this.imageUrl, this.description]
       );
    }

    static delete(id) {
        
    }

    static fetchAll() {
        return db.execute('SELECT * FROM Products');
    }

    static findById(id) {
       return db.execute('SELECT * FROM Products WHERE products.id = ?', [id]);
    }
};
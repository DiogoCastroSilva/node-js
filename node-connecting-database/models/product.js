
// Models using MYSQL
// const Cart = require('./cart');
// // Database
// const db = require('../util/database');


// module.exports = class Product {
//     constructor(title, imageUrl, description, price, id) {
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//         this.id = id;
//     }

//     save() {
//        return db.execute(
//            'INSERT INTO Products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//            [this.title, this.price, this.imageUrl, this.description]
//        );
//     }

//     static delete(id) {
        
//     }

//     static fetchAll() {
//         return db.execute('SELECT * FROM Products');
//     }

//     static findById(id) {
//        return db.execute('SELECT * FROM Products WHERE products.id = ?', [id]);
//     }
// };

// Sequelize
const { Model, DataTypes } = require('sequelize');
// Database Connection
const sequelize = require('../util/database');

class Product extends Model {}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: DataTypes.STRING,
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'product'
});

module.exports = Product;
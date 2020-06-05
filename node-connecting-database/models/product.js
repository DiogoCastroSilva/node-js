
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
// const { Model, DataTypes } = require('sequelize');
// // Database Connection
// const sequelize = require('../util/database');

// class Product extends Model {}

// Product.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: DataTypes.STRING,
//     price: {
//         type: DataTypes.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     sequelize,
//     modelName: 'product'
// });

// module.exports = Product;

// MONGO DB
const { ObjectId } = require('mongodb');
const getDB = require('../util/database').getDB;

class Product {
    constructor(title, imageUrl, description, price, id, userId) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this._id = id ? new ObjectId(id) : undefined;
        this.userId = userId;
    }

    async save() {
        const db = getDB();
        let dbOp;
        if (this._id) {
            // Update product
            dbOp = db.collection('products').updateOne({
                _id: this._id }, { $set: this }
            );
        } else {
            dbOp = db.collection('products').insertOne(this);
        }

        try {
            let result = await dbOp;
            console.log('results', result);
            return result;
        } catch(e) {
            console.log('error', e);
            return e;
        }
    }

    static async fetchAll() {
        const db = getDB();
        try {
            return await db.collection('products').find().toArray();
        } catch(e) {
            console.log('Error fetching products', e);
        }
    }

    static async getProduct(id) {
        const db = getDB();
        try {
            return await db.collection('products').findOne({ _id: new ObjectId(id) });
        } catch(e) {
            console.log('Error fetching product', e);
        }
    }

    static async delete(id) {
        const db = getDB();
        try {
            return await db.collection('products').deleteOne({ _id: new ObjectId(id) });
        } catch(e) {
            console.log('Erro deleting product', e);
        }
    }
}

module.exports = Product;
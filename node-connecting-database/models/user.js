// Sequelize
// const { Model, DataTypes } = require('sequelize');
// // Database Connection
// const sequelize = require('../util/database');

// class User extends Model {}

// User.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: DataTypes.STRING,
//     email: DataTypes.STRING
// },{
//     sequelize,
//     modelName: 'user'
// });

// module.exports = User;
const { ObjectId } = require('mongodb');
const getDB = require('../util/database').getDB;

const table = 'users';
class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // { items[] }
        this._id = id;
    }

    async save() {
        const db = getDB();
        try {
            return await db.collection(table).insertOne(this);
        } catch(e) {
            console.log('Error saving user', e);
        }
    }

    async addToCart(product) {
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        // See if cart alredy has product
        const cartProductIndex = this.cart.items.findIndex(
            cp => cp.productId.toString() === product._id.toString()
        );
        
        if (cartProductIndex >= 0) {
            // If has product add one more to quantity
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            // if doesnt have, add the product withquantity 1
            updatedCartItems.push({ 
                productId: new ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDB();
        return await db
            .collection(table)
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    getCart() {
        const db = getDB();
        const productIds = this.cart.items.map(item => item.productId);
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(product => ({
                    ...product,
                    quantity: this.cart.items.find(item =>
                        item.productId.toString() === product._id.toString()
                    ).quantity 
                }));
            });
    }

    async deleteItemFromCart(id) {
        const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== id.toString());
        
        const db = getDB();
        return await db
            .collection(table)
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            );
    }

    static async getUser(id) {
        const db = getDB();
        try {
            return await db.collection(table).findOne({ _id: new ObjectId(id) });
        } catch(e) {
            console.log('Error saving user', e);
        }
    }

}

module.exports = User;
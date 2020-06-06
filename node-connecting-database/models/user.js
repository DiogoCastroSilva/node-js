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

// MongoDB
// const { ObjectId } = require('mongodb');
// const getDB = require('../util/database').getDB;

// const table = 'users';
// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // { items[] }
//         this._id = id;
//     }

//     async save() {
//         const db = getDB();
//         try {
//             return await db.collection(table).insertOne(this);
//         } catch(e) {
//             console.log('Error saving user', e);
//         }
//     }

//     async addToCart(product) {
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         // See if cart alredy has product
//         const cartProductIndex = this.cart.items.findIndex(
//             cp => cp.productId.toString() === product._id.toString()
//         );
        
//         if (cartProductIndex >= 0) {
//             // If has product add one more to quantity
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             // if doesnt have, add the product withquantity 1
//             updatedCartItems.push({ 
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             });
//         }

//         const updatedCart = {
//             items: updatedCartItems
//         };

//         const db = getDB();
//         return await db
//             .collection(table)
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }

//     getCart() {
//         const db = getDB();
//         const productIds = this.cart.items.map(item => item.productId);
//         return db
//             .collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(product => ({
//                     ...product,
//                     quantity: this.cart.items.find(item =>
//                         item.productId.toString() === product._id.toString()
//                     ).quantity 
//                 }));
//             });
//     }

//     async deleteItemFromCart(id) {
//         const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== id.toString());
        
//         const db = getDB();
//         return await db
//             .collection(table)
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: updatedCartItems } } }
//             );
//     }

//     async addOrder() {
//         const db = getDB();

//         try {
//             const products = await this.getCart();
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             };

//             await db.collection('orders').insertOne(order);
//             this.cart = { items: [] };
//             return await db.collection('users').updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: [] } } }
//             );
//         } catch(e) {
//             console.log('Add Order', e);
//             return e;
//         } 
//     }

//     async getOrders() {
//         const db = getDB();

//         try {
//             return await db.collection('orders')
//                 .find({ 'user._id': new ObjectId(this._id) })
//                 .toArray();
//         } catch(e) {
//             console.log('Get Orders', e);
//             return e;
//         }
//     }

//     static async getUser(id) {
//         const db = getDB();
//         try {
//             return await db.collection(table).findOne({ _id: new ObjectId(id) });
//         } catch(e) {
//             console.log('Error saving user', e);
//         }
//     }

// }

// module.exports = User;

// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {
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
            productId: product._id,
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;
    return this.save(); 
}

userSchema.methods.removeFromCart = function(id) {
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== id.toString());
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
// Sequelize
// const { Model, DataTypes } = require('sequelize');
// // Database Connection
// const sequelize = require('../util/database');

// class Order extends Model {}

// Order.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     }
// }, {
//     sequelize,
//     modelName: 'order'
// });

// module.exports = Order;

// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        name: {
            type: String,
            require: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);
// Sequelize
const { Model, DataTypes } = require('sequelize');
// Database Connection
const sequelize = require('../util/database');

class CartItem extends Model {}

CartItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'cartItem'
});

module.exports = CartItem;
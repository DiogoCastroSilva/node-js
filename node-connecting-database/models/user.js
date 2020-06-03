// Sequelize
const { Model, DataTypes } = require('sequelize');
// Database Connection
const sequelize = require('../util/database');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING
},{
    sequelize,
    modelName: 'user'
});

module.exports = User;
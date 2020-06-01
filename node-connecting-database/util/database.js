// MYSQL
// const mysql = require('mysql2');

// const poll = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '12345678'
// });

// module.exports = poll.promise();

// SEQUELIZE
const { Sequelize } = require('sequelize');

// Connect Database
const sequelize = new Sequelize('node-complete', 'root', '12345678', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
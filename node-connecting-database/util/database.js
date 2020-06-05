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
// const { Sequelize } = require('sequelize');

// // Connect Database
// const sequelize = new Sequelize('node-complete', 'root', '12345678', {
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;

// MONGO DB
const { MongoClient } = require('mongodb');

// Database link connection
const url = "mongodb+srv://Diogo:asdzxc@cluster0-fnsz5.mongodb.net/shop?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let _db;

const mongoDBConnect = async (calback) => {
    try {
        // Connect to mongoDB
        await client.connect();
        console.log("Mongo DB Connected");
        _db = client.db();
        calback();
    } catch(e) {
        console.log("Connection error", e);
    }
};

const getDB = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!!';
};

module.exports = {
    mongoDBConnect: mongoDBConnect,
    getDB: getDB
};



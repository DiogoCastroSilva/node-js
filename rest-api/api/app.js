// Core
const express = require('express');
const path = require('path');

// Packages
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Routes
const feedRoutes = require('./routes/feed');

// Create Server
const app = express();

// Serving json data
app.use(bodyParser.json());
// Serving folder images
app.use(
    '/images',
    express.static(path.join(__dirname, 'images'))
);

// Seting CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

// Error handling
app.use((error, req, res, next) => {
    console.log('Error middleware', error);
    const status = error.statusCode || 500;
    const message = error.message;
    res
        .status(status)
        .json({
            message: message
        });
});

// Connecting to database and turning the server on
mongoose
    .connect(
        'mongodb+srv://Diogo:asdzxc@cluster0-fnsz5.mongodb.net/messages?retryWrites=true&w=majority'
    )
    .then(() => {
        app.listen(8080);
    })
    .catch(e => {
        throw new Error('Error connecting to database', e);
    });



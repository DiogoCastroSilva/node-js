// Core
const express = require('express');

// Packages
const bodyParser = require('body-parser');


// Routes
const feedRoutes = require('./routes/feed');

// Create Server
const app = express();

app.use(bodyParser.json());

// Seting CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.listen(8080);
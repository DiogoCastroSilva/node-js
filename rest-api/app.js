// Core
const express = require('express');

// Packages
const bodyParser = require('body-parser');


// Routes
const feedRoutes = require('./routes/feed');

// Create Server
const app = express();

app.use(bodyParser.json());

app.use('/feed', feedRoutes);

app.listen(8080);
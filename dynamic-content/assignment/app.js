// Core
const path = require('path');
const bodyParser = require('body-parser');

// Express
const express = require('express');

// Routes
const homeRoute = require('./routes/home');
const usersData = require('./routes/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
// Set pug as the template engine
app.set('view engine', 'pug');

// Define public folder
app.use(express.static(path.join(__dirname, 'public')));


// Define routes
app.use(homeRoute);
app.use(usersData.router);

// Create and connect to server
app.listen(3000);
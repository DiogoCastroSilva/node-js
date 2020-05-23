// Path
const path = require('path');
// Express
const express = require('express');

// Routes
const homeRoute = require('./routes/home');
const usersRoute = require('./routes/users');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(usersRoute);
app.use(homeRoute);


app.listen(3000);
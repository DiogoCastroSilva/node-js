// Express
const express = require('express');

const app = express();

app.use('/product', (req, res, next) => {
    console.log('Product middleware!');
    res.send('<h1>Hello from Product Express</h1>');
});

app.use('/', (req, res, next) => {
    console.log('First middleware!');
    res.send('<h1>Hello from Express</h1>');
});

// Creates and turns on the server
app.listen(3000);
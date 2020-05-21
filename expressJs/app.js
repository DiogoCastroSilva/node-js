// Express
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/add-product', (req, res) => {
    console.log('Add Product middleware!');
    res.send('<form action="/product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>');
});

app.post('/product', (req, res, next) => {
    console.log('Product middleware!');
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
    console.log('First middleware!');
    res.send('<h1>Hello from Express</h1>');
});

// Creates and turns on the server
app.listen(3000);
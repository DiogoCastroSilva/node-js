// Path
const path = require('path');

// Express
const express = require('express');
// Body Parser
const bodyParser = require('body-parser');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Controllers
const errorController = require('./controllers/404');

// Database
const db = require('./util/database');


const app = express();

// Add pug template engine
app.set('view engine', 'pug');
// Default behaviour
app.set('views', 'views');

// db.execute('SELECT * FROM Products')
// .then(products => {
//     console.log(products);
// }).catch(err => {
//     console.log(err);
// });

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
// 404 Route
app.use(errorController.get404Page);

// Creates and turns on the server
app.listen(3000);
// Core
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// Session
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://Diogo:asdzxc@cluster0-fnsz5.mongodb.net/shop?retryWrites=true&w=majority';
// Mongoose
const mongoose = require('mongoose');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Controllers
const errorController = require('./controllers/404');

// Models
const User = require('./models/user');


const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

// Add pug template engine
app.set('view engine', 'pug');
// Default behaviour
app.set('views', 'views');

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store })
);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        }).catch(e => {
            console.log('Error geting user on start app' ,e);
        });
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// 404 Route
app.use(errorController.get404Page);

// Mongoose
mongoose
    .connect(MONGODB_URI)
    .then(() => {   
        app.listen(3000);
    }).catch(e => {
        console.log('Erro connecting to server', e);
    });

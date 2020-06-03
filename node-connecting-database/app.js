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

// Models
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

// Database
const sequelize = require('./util/database');


const app = express();

// Add pug template engine
app.set('view engine', 'pug');
// Default behaviour
app.set('views', 'views');

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    });
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
// 404 Route
app.use(errorController.get404Page);

// Data Associations
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
    //.sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            User.create({ name: 'Max', email: 'max@max.com' });
        }
        return Promise.resolve(user);
    })
    .then(user => {
        return user.createCart(); 
    })
    .then(cart => {
        // Creates and turns on the server
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

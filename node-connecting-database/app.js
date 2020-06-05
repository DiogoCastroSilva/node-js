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

// Database
// const sequelize = require('./util/database');
const mongoConnect = require('./util/database').mongoDBConnect;

const app = express();

// Add pug template engine
app.set('view engine', 'pug');
// Default behaviour
app.set('views', 'views');

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.getUser('5ed9747d7f2b56de5efca8a4').then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }).catch(e => {
        console.log('Error geting user on start app' ,e);
    });
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
// 404 Route
app.use(errorController.get404Page);

// Sequelize Relations
// Data Associations
// Product.belongsTo(User, {
//     constraints: true,
//     onDelete: 'CASCADE'
// });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// Sequelize Connection
// sequelize
//     //.sync({ force: true })
//     .sync()
//     .then(result => {
//         return User.findByPk(1);
//     })
//     .then(user => {
//         if (!user) {
//             User.create({ name: 'Max', email: 'max@max.com' });
//         }
//         return user;
//     })
//     .then(user => {
//         return user.createCart(); 
//     })
//     .then(cart => {
//         // Creates and turns on the server
//         app.listen(3000);
//     })
//     .catch(err => {
//         console.log(err);
//     });

mongoConnect(() => {
    app.listen(3000);
});

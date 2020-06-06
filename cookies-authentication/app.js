// Path
const path = require('path');

// Express
const express = require('express');
// Body Parser
const bodyParser = require('body-parser');

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

// Add pug template engine
app.set('view engine', 'pug');
// Default behaviour
app.set('views', 'views');

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5edb711b2f71cd16b95bceb2')
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
    .connect('mongodb+srv://Diogo:asdzxc@cluster0-fnsz5.mongodb.net/shop?retryWrites=true&w=majority')
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Diogo',
                    email: 'diogo@diogo.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        
        app.listen(3000);
    }).catch(e => {
        console.log('Erro connecting to server', e);
    });

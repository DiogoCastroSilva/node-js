// Path
const path = require('path');

// Express
const express = require('express');
// Body Parser
const bodyParser = require('body-parser');
// Handlebars
const expressHbs = require('express-handlebars');

// Routes
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');



const app = express();

// EJS
app.set('view engine', 'ejs');

// Add Handlebars template engine
// app.engine('handlebars', expressHbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout' }));
// app.set('view engine', 'handlebars');

// Add pug template engine
// app.set('view engine', 'pug');

// Default behaviour
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminData.routes);
app.use(shopRoutes);


app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found', path: null });
});

// Creates and turns on the server
app.listen(3000);
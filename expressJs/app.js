// Express
const express = require('express');
// Body Parser
const bodyParser = require('body-parser');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use((req, res) => {
    res.status(404).send('<p>Page Not Found!</p>');
});

// Creates and turns on the server
app.listen(3000);
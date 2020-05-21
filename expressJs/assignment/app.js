// Express
const express = require('express');

const app = express();


app.use('/users', (req, res, next) => {
    res.send('Users page');
});

app.use('/', (req, res, next) => {
    res.send('Home page');
});

// Create and start server
app.listen(3000);
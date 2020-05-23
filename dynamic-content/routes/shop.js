// Path
const path = require('path');
// Express
const express = require('express');

// Util
const rootDir = require('../util/path');
// Routes
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log(adminData.products);
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
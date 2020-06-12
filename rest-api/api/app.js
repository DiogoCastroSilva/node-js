// Core
const path = require('path');

// Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');


// Routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

// Create Server
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Serving json data
app.use(bodyParser.json());
// Muler config for serving and saving images
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    })
    .single('image')
);
// Serving folder images
app.use(
    '/images',
    express.static(path.join(__dirname, 'images'))
);

// Seting CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Error handling
app.use((error, req, res, next) => {
    console.log('Error middleware', error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    
    res
        .status(status)
        .json({
            message: message,
            data: data
        });
});

// Connecting to database and turning the server on
mongoose
    .connect(
        'mongodb+srv://Diogo:asdzxc@cluster0-fnsz5.mongodb.net/messages?retryWrites=true&w=majority'
    )
    .then(() => {
        app.listen(8080);
    })
    .catch(e => {
        throw new Error('Error connecting to database', e);
    });



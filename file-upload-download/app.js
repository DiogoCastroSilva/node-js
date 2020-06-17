// Core
const path = require('path');
const express = require('express');
const fs = require('fs');
// const https = require('https');
// Packages
const bodyParser = require('body-parser');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
// Session
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-fnsz5.mongodb.net/${process.env.MONGO_DB}`;

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Controllers
const errorController = require('./controllers/error');

// Models
const User = require('./models/user');


const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

// const privateKey = fs.readFileSync('server-key');
// const certificate = fs.readFileSync('server');


// Storage config
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
});

const fileStorageFilter = (req, file, cb) => {
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

// Add pug template engine
app.set('view engine', 'pug');
// Default behaviour
app.set('views', 'views');

// Add logging
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

// Config
app.use(helmet());
app.use(compression());
app.use(
    morgan('combined',{
        stream: accessLogStream
    })
);
// Works only with text values
app.use(bodyParser.urlencoded({ extended: false }));
// Works with files - And looks for the input with id image
app.use(multer({
    storage: fileStorage,
    fileFilter: fileStorageFilter
}).single('image'));
// Folder that app serves
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'files')));
app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store })
);
app.use(csrfProtection);
app.use(flash());

// Set token
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(e => {
            next(new Error('Error geting user on start app' ,e));
        });
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// Error Routes
app.use('/500', errorController.get500Page);
app.use(errorController.get404Page);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    console.log(error);
    res.redirect('/500');
});

// Mongoose
mongoose
    .connect(MONGODB_URI)
    .then(() => {   
        app.listen(process.env.PORT || 3000);
        // https
        //     .createServer({ key: privateKey, cert: certificate }, app)
        //     .listen(process.env.PORT || 3000);
    }).catch(e => {
        throw new Error('Erro connecting to server', e);
    });

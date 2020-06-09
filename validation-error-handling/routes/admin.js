// Express
const express = require('express');
// Validator
const { body } = require('express-validator');

// Controllers
const adminController = require('../controllers/admin');

// Middlewares
const isAuth = require('../middleware/is-auth');


const router = express.Router();

// GET
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

router.get('/products', isAuth, adminController.getProducts);

// POST
router.post('/add-product', isAuth, 
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim()
            .withMessage('Title should be a string with a  minimum of 3 characters'),
        body('imageUrl').isURL().withMessage('Image should be a valid url'),
        body('price').isFloat().withMessage('Price should be a decimal number'),
        body('description')
            .isLength({ min: 5, max: 400 })
            .withMessage('Description should have a minimum of 3 characters and a max of 400')
            .trim()
    ]
    ,adminController.postAddProduct);

router.post('/edit-product', isAuth,
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim()
            .withMessage('Title should be a string with a  minimum of 3 characters'),
        body('imageUrl')
            .isURL()
            .withMessage('Image should be a valid url'),
        body('price')
            .isFloat()
            .withMessage('Price should be a decimal number'),
        body('description')
            .isLength({ min: 5, max: 400 })
            .withMessage('Description should have a minimum of 3 characters and a max of 400')
            .trim()
    ],
    adminController.postEditProduct);

router.post('/delete-product/:id', isAuth, adminController.deleteProduct);

// Exports
module.exports = router;
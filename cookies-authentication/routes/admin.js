// Express
const express = require('express');

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
router.post('/add-product', isAuth, adminController.postAddProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product/:id', isAuth, adminController.deleteProduct);

// Exports
module.exports = router;
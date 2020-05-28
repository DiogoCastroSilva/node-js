// Path
const path = require('path');
// Express
const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();


// GET
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:id', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);


// POST
router.post('/cart', shopController.addToCart);


module.exports = router;
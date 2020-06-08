// Express
const express = require('express');

// Controllers
const shopController = require('../controllers/shop');

// Middlewares
const isAuth = require('../middleware/is-auth');


const router = express.Router();

// GET
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:id', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/checkout', shopController.getCheckout);


// POST
router.post('/cart', isAuth, shopController.addToCart);

router.post('/cart-delete-item', isAuth, shopController.postDeleteProduct);

router.post('/create-order', isAuth, shopController.addOrder);


module.exports = router;
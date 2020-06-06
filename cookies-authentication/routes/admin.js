// Path
const path = require('path');

// Express
const express = require('express');

// Controllers
const adminController = require('../controllers/admin');

const router = express.Router();

// GET
router.get('/add-product', adminController.getAddProduct);

router.get('/edit-product/:id', adminController.getEditProduct);

router.get('/products', adminController.getProducts);

// POST
router.post('/add-product', adminController.postAddProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product/:id', adminController.deleteProduct);

// Exports
module.exports = router;
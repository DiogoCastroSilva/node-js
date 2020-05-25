// Path
const path = require('path');

// Express
const express = require('express');

// Controllers
const productsController = require('../controllers/products');

const router = express.Router();

// GET
router.get('/add-product', productsController.getAddProduct);

// POST
router.post('/add-product', productsController.postAddProduct);

// Exports
module.exports = router;
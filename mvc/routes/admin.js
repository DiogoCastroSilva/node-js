// Path
const path = require('path');

// Express
const express = require('express');

// Controllers
const adminController = require('../controllers/admin');

const router = express.Router();

// GET
router.get('/add-product', adminController.getAddProduct);

router.get('/products');

// POST
router.post('/add-product', adminController.postAddProduct);

// Exports
module.exports = router;
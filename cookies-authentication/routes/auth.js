// Express
const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// GET
router.get('/login', authController.getLogin);

// POST
router.post('/login', authController.postLogin);

module.exports = router;
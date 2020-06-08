// Express
const express = require('express');

// Controllers
const authController = require('../controllers/auth');


const router = express.Router();

// GET
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);

// POST
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignup);

module.exports = router;
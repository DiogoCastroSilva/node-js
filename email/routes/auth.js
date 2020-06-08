// Express
const express = require('express');

// Controllers
const authController = require('../controllers/auth');


const router = express.Router();

// GET
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/new-password/:token', authController.getNewPassword);

// POST
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignup);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
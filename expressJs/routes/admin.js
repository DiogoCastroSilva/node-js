// Express
const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res) => {
    console.log('Add Product middleware!');
    res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>');
});

router.post('/add-product', (req, res) => {
    console.log('Product middleware!');
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
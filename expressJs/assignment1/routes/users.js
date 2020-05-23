// Path
const path = require('path');
// Express
const express = require('express');


const router = express.Router();

router.get('/users', (req, res) => {
    res.sendFile(path.join(path.dirname(process.mainModule.filename), 'views', 'users.html'));
});

// Export Route
module.exports = router;
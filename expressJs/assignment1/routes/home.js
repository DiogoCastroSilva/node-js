// Path
const path = require('path');
// Express
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(path.dirname(process.mainModule.filename), 'views', 'home.html'));
});

// Export Route
module.exports = router;
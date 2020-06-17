// Core
const path = require('path');
const fs = require('fs');

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, e => {
        if (e) {
            console.log('Error deleting image file', e)
        }
    });
};

module.exports.clearImage = clearImage;
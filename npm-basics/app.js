const http = require('http');
// File System
// const fs = require('fs');

// Routes
const routes = require('./routes');


// Creates a server
const server = http.createServer(routes)

// Turns on the server
server.listen(3000);

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.setHeader('Content-type', 'text/html');
        res.write('<html>');
        res.write('<head><title>My First Page</title></head>');
        res.write('<body>');
        res.write('<h1>Hello from node js server</h1>');
        res.write('<br />');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username" /><button type="submit">Submit</button></form>')
        res.write('</body>');
        res.write('</html>');
        res.end();
    }

    if (url === '/users') {
        res.setHeader('Content-type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Users</title></head>');
        res.write('<body>');
        res.write('<h1>Users list</h1>');
        res.write('<br />');
        res.write('<ul><li>user 1</li><li>user 2</li><li>user 3</li></ul>')
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
    
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            console.log(message);
        });
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }

};

module.exports = requestHandler;
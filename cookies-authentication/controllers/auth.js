
// GET
exports.getLogin = (req, res) => {
    const isLoggedIn = req
        .get('Cokkie')
        .split(';')[1]
        .trim()
        .split('=')[1];
    res.render('auth/login', {
        path: '/login',
        title: 'Login',
        docTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};

// POST
exports.postLogin = (req, res) => {
    req.setHeader('Set-Cookie', 'isLogedIn=true');
    res.redirect('/');
};
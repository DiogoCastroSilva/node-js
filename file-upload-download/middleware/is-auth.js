module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return req.redirect('/login')
    }
    next();
};
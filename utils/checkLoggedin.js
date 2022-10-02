function checkLoggedIn(req, res, next) {
    const isLoggedIn = req.user;
    if (!isLoggedIn) {
        res.status(401).json({
            error: 'you must be logged in'
        })
    }
    next();
}

module.exports = {
    checkLoggedIn,
}
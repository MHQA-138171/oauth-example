const express = require('express');
const passport = require('passport')

const authRouter = express.Router();

authRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['email']
}))
authRouter.get('/auth/google/callBack', passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/',
    session: true,
}), (req, res) => {
    console.log('google called us back!')
})
authRouter.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})
authRouter.get('/auth/failure', (req, res) => {
    res.send('failed to login!')
})
module.exports = authRouter;
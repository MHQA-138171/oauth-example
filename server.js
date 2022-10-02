const fs = require('fs');
const path = require('path');
const https = require('https');
const helemt = require('helmet');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const { Strategy } = require('passport-google-oauth20');

require('dotenv').config();

const authRouter = require('./Routers/auth.router');
const { checkLoggedIn } = require('./utils/checkLoggedin');
const { verifyCallback } = require('./utils/verifyCallback')

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}
const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}
passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser((id, done) => {
    done(null, id);
})
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

const App = express();

App.use(helemt());
App.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2]
}));
App.use(passport.initialize());
App.use(passport.session());
App.use(express.json());
App.use(authRouter);

App.get('/secret', checkLoggedIn, (req, res) => {
    return res.send('Your secret number is 55')
})
App.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'privateKey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'certificate.pem')),
}, App).listen(3000, () => {
    console.log("listening on port 3000")
});
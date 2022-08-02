var express = require('express');
var router = express.Router();

const lotsModel = require('../database/model/lotModel');
const auth = require('../auth/tokenUtil');

require('dotenv').config();

/* GET / login page. */
router.get('/', function(req, res, next) {
    res.render('page/login/login.ejs');
});

/* POST / route */
router.post('/', async function(req, res) {
    const user_info = req.body;

    if (
        user_info.username === process.env.USERNAME &&
        user_info.password === process.env.PASSCODE
    ) {
        const tokenPayload = {
            tzOffset: user_info.tzOffset,
            username: user_info.username,
        };
        const token = await auth.generateToken(tokenPayload);
        res.clearCookie('user');
        res.cookie('user', token);
        res.redirect('/v0/predictions');
    } else {
        res.status(401).send('Access Denied');
    }
});

/* Logout route */
router.get('/logout', function(req, res, next) {
    res.clearCookie('user');
    console.log('Logged out');
    res.redirect('/');
});

module.exports = router;

var express = require('express');
var router = express.Router();

const lotsModel = require('../database/model/lotModel');
const { route } = require('./parking_lot');

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('page / login/login.ejs');
});

module.exports = router;

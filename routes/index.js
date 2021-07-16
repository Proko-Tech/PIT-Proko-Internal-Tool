var express = require('express');
var router = express.Router();

const lotsModel = require('../database/model/lotModel');
const { route } = require('./parking_lot');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('page / login/login.ejs');
});

/* POST / route */
router.post("/", async function(req, res) {
});


module.exports = router;


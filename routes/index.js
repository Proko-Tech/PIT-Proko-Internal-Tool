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
router.post("/", async function(req, res) {
  let user_info = req.body
 
  if (user_info.username === process.env.USERNAME && 
      user_info.password === process.env.PASSCODE) {

    let token = auth.generateToken(user_info);

    if (auth.validateToken(token)) {
      res.redirect('/parking/new');
    } else {
      res.status(401).send("Access Denied");
    } 
  }
});

/* TESTER FOR PARKINGLOTS.EJS GET*/
router.get('/parking', function(req, res, next) {
  res.render('/page/parkingLot/parkingLots.ejs');
});
module.exports = router;

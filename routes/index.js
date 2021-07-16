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
  console.log(user_info);
  console.log(user_info.username === process.env.USERNAME && user_info.password === process.env.PASSCODE);
 
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

module.exports = router;

var express = require('express');
var router = express.Router();

const lotsModel = require('../database/model/lotModel');
const auth = require('../auth/tokenUtil');

require('dotenv').config();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const result = await lotsModel.get();
  res.render('index', { title: 'Express', result });

});

/* POST / route */
router.post("/", async function(req, res) {
  let user_info = {
    username: req.body.username,
    password: req.body.password
  }

  if (user_info.username == process.env.username && 
      user_info.password == process.env.password) {

    let token = auth.generateToken(user_info);

    if (auth.validateToken(token)) {
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  }
});

module.exports = router;

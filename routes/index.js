var express = require('express');
var router = express.Router();

const lotsModel = require('../database/model/lotModel');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const result = await lotsModel.get();
  const a = await lotsModel.getByAdminId('1');
   console.log(a);
  res.render('index', { title: 'Express', result });

});


module.exports = router;

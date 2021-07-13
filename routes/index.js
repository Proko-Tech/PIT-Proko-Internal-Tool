var express = require('express');
var router = express.Router();

const lotsModel = require('../database/model/lotModel');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const result = await lotsModel.get();
  res.render('index', { title: 'Express', result });
});
/* get new page. */
router.get('/new', async function(req, res, next) {
  res.render('../views/page/parkingLot/newParkingLot');
});


module.exports = router;

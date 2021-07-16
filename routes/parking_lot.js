var express = require("express");
var router = express.Router();

const lot_model = require("../database/model/lotModel");


/* GET new route */

router.get('/new', async function(req, res, next) {
    res.render('page/parkingLot/newParkingLot');


/* GET parking_lot route */
router.get("/parking_lot", function(req, res) {
    res.end("/parking_lot");
});

/* POST parking_lot route */
router.post("/parking_lot", async function(req, res) {
    await lot_model.insert(req.body);
});

module.exports = router;

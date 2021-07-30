var express = require("express");
var router = express.Router();

const lot_model = require("../database/model/lotModel");
const lot_ownerships_model = require("../database/model/lotOwnershipsModel");

/*TEST for SpotsModel */
const spot_model = require("../database/model/spotsModel");

/* GET new route */
router.get('/new', async function(req, res, next) {
    res.render('page/parkingLot/newParkingLot');
});
/* POST new parking lot */
router.post("/new", async function (req, res) {
   await lot_ownerships_model.insert(req.body);
});

/* GET parking_lot route */
router.get("/parking_lot", async function(req, res) {
    const lotsInfo = await lot_model.get();
    // res.json(lotsInfo);
    res.render("page/parkingLot/parkingLots",{title:"parking lots", lotsInfo});
});

/* POST parking_lot route */
router.post("/parking_lot", async function(req, res) {
    await lot_model.insert(req.body);
});

/* TEST for parking lot spots route */
router.get("/lotID", async function(req,res) {
    const spotInfo = await spot_model.getSpots(req.query.lotId);
    res.render("page/parkingLot/parkingLotSpots", {spotsInfo});
});



module.exports = router;

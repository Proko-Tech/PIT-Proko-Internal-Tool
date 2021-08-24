var express = require("express");
var router = express.Router();

const lot_model = require("../database/model/lotModel");
const lot_ownerships_model = require("../database/model/lotOwnershipsModel");

/*TEST for SpotsModel */
const spot_model = require("../database/model/spotsModel");

/* GET new route */
router.get('/new', async function (req, res, next) {
    res.render('page/parkingLot/newParkingLot', { title: 'New Parking Lot' });
});

/* POST new parking lot */
router.post("/new", async function (req, res) {
    console.log(req.body);
    await lot_ownerships_model.insert(req.body);
});

/* GET parking_lot route */
router.get("/parking_lot", async function (req, res) {
    const lotsInfo = await lot_model.get();
    console.log(lotsInfo);
    res.render("page/parkingLot/parkingLots", { title: "Parking Lots", lotsInfo });
});

/* POST parking_lot route */
router.post("/parking_lot", async function (req, res) {
    await lot_model.insert(req.body);
    console.log(req.body);
    //fix 'req.body' below
   /* let spotData = req.body.map(function(lot) => {
        return { 
            "id": // Get spot id
            "lot_id": // Get lot id

        }
    } */
    

    // Another Function for lot ownership here.

});

/* TEST for parking lot spots route */
router.get("/lotID", async function (req, res) {
    const spotsInfo = await spot_model.getSpots(req.query.lotId);
    res.render("page/parkingLot/parkingLotSpots", { title: "Spots Directory", spotsInfo });
});

/* POST parking_lot route */
router.post("/update_parking_lot", async function (req, res) {
    const { id } = req.params;
    const changes = req.body;

    try {
        const result = await lot_model.update(id, changes);
        if (result) {
            res.status(200).json({ message: result })
        } else {
            res.status(404).json({ message: "Record not found" })
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating new post", error: err })
    }
});

module.exports = router;

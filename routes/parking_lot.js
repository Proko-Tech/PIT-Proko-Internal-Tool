var express = require("express");
var router = express.Router();

const lot_model = require("../database/model/lotModel");
const spots_model = require("../database/model/spotsModel");
const lot_ownerships_model = require("../database/model/lotOwnershipsModel");

/*TEST for SpotsModel */
const spot_model = require("../database/model/spotsModel");

/* GET new route */
router.get('/new', async function (req, res, next) {
    res.render('page/parkingLot/newParkingLot', { title: 'New Parking Lot' });
});

/* POST new parking lot */
router.post("/new", async function (req, res) {
    //console.log(req.body);
    await lot_model.insert(req.body); //Need to extract lot_id
    let lotID = await lot_model.getMax();
    let levelData = req.body.spots_num.map((spot) => {
        for (let i = 0; i < spot; i++) {
            return {
                "spot_status": "UNOCCUPIED",
                "alive_status": 0,
                "is_charging_station": 0,
                "secret": lotID, 
                "spot_name": "",
            }
        }
    });
    await spots_model.create(levelData); //create in spotsModel is the same as insert for lotModel

    let lotOwnData = {
        "admin_id": 0,
        "lot_id": lotID
    }
    await lot_ownerships_model.insert(lotOwnData);
});

/* GET parking_lot route */
router.get("/parking_lot", async function (req, res) {
    const lotsInfo = await lot_model.get();
    res.render("page/parkingLot/parkingLots", { title: "Parking Lots", lotsInfo });
});

/* POST parking_lot route */
router.post("/parking_lot", async function (req, res) {
    await lot_model.insert(req.body);
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

var express = require("express");
var router = express.Router();

const admin_account_model = require("../database/model/adminAccountsModel");
const lot_model = require("../database/model/lotModel");
const spots_model = require("../database/model/spotsModel");
const lot_ownerships_model = require("../database/model/lotOwnershipsModel");

/*TEST for SpotsModel */
const spot_model = require("../database/model/spotsModel");

/* GET new route */
router.get('/new', async function (req, res, next) {
    const adminAccounts = await admin_account_model.get();
    res.render('page/parkingLot/newParkingLot', { title: 'New Parking Lot',adminAccounts});
});

/* POST new parking lot */
router.post("/new", async function (req, res) {
    //console.log(req.body);
    var lotData = {
        "address": req.body.address,
        "city": req.body.city,
        "name": req.body.name,
        "price_per_hour": req.body.price_per_hour,
        "state": req.body.state,
        "zip": req.body.zip
    }
    await lot_model.insert(lotData);
    let lotID = await lot_model.getMax(); //extracting lotID

    // If statement in the case there is only one level, the map function is inappropriate
    const spots_num = new Array(req.body.spots_num);
    let spotInfo = req.body.spots_num.length===1?spots_num:req.body.spots_num;

    let levelData = spotInfo.map((spot) => {
        for (let i = 0; i < spot; i++) {
            return {
                "spot_status": "UNOCCUPIED",
                "alive_status": 0,
                "is_charging_station": 0,
                "secret": lotID,
                "spot_name": "",
                "is_reservable": 1
            }
        }
    });
    await spots_model.create(levelData); //create in spotsModel is the same as insert for lotModel

    let lotOwnData = {
        "admin_id": 0,
        "lot_id": lotID
    }
    await lot_ownerships_model.insert(lotOwnData);
    res.json(levelData);
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

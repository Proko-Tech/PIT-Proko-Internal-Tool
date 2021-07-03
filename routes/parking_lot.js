var express = require("express");
var router = express.Router();

const lot_model = require("../database/model/lotModel");

/* GET parking_lot route */
router.get("/parking_lot", (req, res) => {
    lot_model.get();
});

/* POST parking_lot route */
router.post("/parking_lot", (req, res) => {
});

module.exports = router;

var express = require("express");
var router = express.Router();

const Lots = require("../database/model/lotModel");

/* GET parking_lot route */
router.get("/parking_lot", (req, res) => {
    Lots.get();
});

/* POST parking_lot route */
router.post("/parking_lot", (req, res) => {
});

module.exports = router;
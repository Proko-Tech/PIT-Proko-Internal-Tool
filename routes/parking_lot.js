var express = require("express");
var router = express.Router();

const Lots = require("../database/model/lotModel");

/* POST parking_lot route */
router.post("/parking_lot", (req, res) => {
      Lots.insert(req.body);
});

module.exports = router;
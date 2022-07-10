var express = require('express');
var router = express.Router();

const firmwareControlModel = require('../database/model/firmwareControlModel');

router.get('/', async function (req, res, next) {
    const lot_id = req.params.id;
    const firmwareControl = await firmwareControlModel.get();

    res.render('page/firmwareControl/firmwareControl.ejs', { title:"ProkoPark - Firmware Control", firmwareControl });
});

module.exports = router;
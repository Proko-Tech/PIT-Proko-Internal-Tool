var express = require('express');
var router = express.Router();

const admin_account_model = require("../database/model/adminAccountsModel");
const lot_model = require("../database/model/lotModel");
const spot_model = require("../database/model/spotsModel");
const lot_ownerships_model = require("../database/model/lotOwnershipsModel");
const moment = require("moment");

const QR = require('../utils/quick_response');
const pick = require('../utils/pick');
const crypto = require('crypto');

/* GET new route */
router.get('/new', async function(req, res, next) {
    const adminAccounts = await admin_account_model.get();
    res.render('page/parkingLot/newParkingLot', {
        title: 'New Parking Lot',
        adminAccounts,
    });
});

/* POST new parking lot */
router.post('/new', async function(req, res) {
    try {
        const current_date = new Date().valueOf().toString();
        const random = Math.random().toString();
        const hash = crypto
            .createHash('sha1')
            .update(current_date + random)
            .digest('hex');

        // Preparing JSON for insertion
        const lotData = {
            ...pick(req.body, [
                'address',
                'city',
                'name',
                'price_per_hour',
                'state',
                'zip',
                'long',
                'lat',
            ]),
            hash,
        };
        const spotsData = await Promise.all(
            req.body.spot_name.map((name, index) => {
                const spot = {
                    spot_name: name,
                    secret: req.body.secret[index],
                    firmware_version: req.body.firmware_version[index],
                    available_firmware_version:
                        req.body.firmware_version[index],
                    alive_status: false,
                    is_charging_station: false,
                    spot_status: 'UNOCCUPIED',
                };
                return spot;
            }),
        );

        const {insertResult} = await lot_model.insertWithSpotsAndOwnership(
            lotData,
            spotsData,
            req.body.admin_id,
        );
        if (insertResult === 'failed') {
            return res.status(503);
        }

        return res.redirect('/parking/parking_lot');
    } catch (err) {
        console.error(err);
        return res.status(503);
    }
});

/* GET parking_lot route */
router.get('/parking_lot', async function(req, res) {
    const lotsInfo = await lot_model.get();
    res.render('page/parkingLot/parkingLots', {
        title: 'Parking Lots',
        lotsInfo,
    });
});

/* POST parking_lot route */
router.post('/parking_lot', async function(req, res) {
    await lot_model.insert(req.body);
});

/* TEST for parking lot spots route */
router.get("/lotID", async function(req, res) {
    const spotsInfoRaw = await spot_model.getByLotId(req.query.lotId);
    const spotsInfo = await spotsInfoRaw.map((row, index) => {
        row.created_at = moment(row.created_at).format('MM-DD-YYYY');
        return row;
    });
    res.render("page/parkingLot/parkingLotSpots", {title: "Spots Directory", spotsInfo});
});

/* POST parking_lot route */
router.post('/update_parking_lot', async function(req, res) {
    const {id} = req.params;
    const changes = req.body;

    try {
        const result = await lot_model.update(id, changes);
        if (result) {
            res.status(200).json({message: result});
        } else {
            res.status(404).json({message: 'Record not found'});
        }
    } catch (err) {
        res.status(500).json({message: 'Error updating new post', error: err});
    }
});

router.get('/QR', async function(req, res) {
    const {public_key} = req.query;
    const base64 = await QR.create(public_key);
    console.log(base64)
    res.send(base64)
});

module.exports = router;

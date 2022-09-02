var express = require('express');
var router = express.Router();

const spotsModel = require('../database/model/spotsModel');
const manualCaptureModel = require('../database/model/manualCaptureModel');

router.get('/:lot_id/:spot_hash', async function(req, res, next) {
    const {lot_id, spot_hash} = req.params;
    const spotCaptureData = await manualCaptureModel.getBySpotHash(spot_hash);
    res.render('page/spots/spots', {title: "Spot Detail " + "lot Id="+ lot_id + " spot_hash=" + spot_hash,
        lot_id, spot_hash, spotCaptureData});
});

router.put('/manual_capture', async function(req, res, next) {
    try {
        const uploadPayload = {
            manual_capture: true,
        }
        const update_stat =
            await spotsModel.update([req.body.spot_hash], uploadPayload);
        if (update_stat.status === 'failed') {
            return res.status(500).json({message: 'Update failed', error: update_stat.err});
        }
        return res.status(200).json({message: 'Update success'});
    } catch (err) {
        return res.status(500).json({message: err});
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();

const spotsModel = require('../database/model/spotsModel');
const manualCaptureModel = require('../database/model/manualCaptureModel');

router.get('/manual_capture', async function(req, res, next) {
    const {lot_id, spot_hash} = req.query;
    const spotCaptureData = await manualCaptureModel.getBySpotHash(spot_hash);
    res.render('page/manualCapture/manualCapture', {title: "Spot Detail " + "lot Id="+ lot_id + " spot_hash=" + spot_hash,
        lot_id, spot_hash, spotCaptureData});
});

/**
 * Set the manual_capture field of spots table to true
 * @param req.body.spot_hash - the hash of the spot to be updated
 */
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

/**
 * Delete the manually captured image by id
 * @param req.body.id - the id of the image to be deleted
 */
router.delete('/manual_capture', async function(req, res, next) {
    try {
        const delete_stat = await manualCaptureModel.deleteById(req.body.id);
        if (delete_stat.status === 'failed') {
            return res.status(500).json({message: 'Delete failed', error: delete_stat.err});
        }
        return res.status(200).json({message: 'Delete success'});
    }
    catch (err) {
        return res.status(500).json({message: err});
    }
});

/**
 * get manually captured images by id
 * @param req.body.id - the id of the image to be displayed
 */
router.get('/manual_capture/detail', async function(req, res, next) {
    const {id} = req.query;
    try {
        const capturedImageData = await manualCaptureModel.getById(id);
        res.render('page/manualCapture/manualCaptureDetail', {
            title: "Manual Capture Image Id = " + id + " Detail",
            capturedImageData,
        });
    } catch (err) {
        return res.status(500).json({message: err});
    }
});
module.exports = router;
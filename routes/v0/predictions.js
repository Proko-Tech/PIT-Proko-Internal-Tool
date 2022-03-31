const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');

const predictionsModel = require('../../database/model/predictionsModel');

router.get('/', async function (req, res, next) {
    try {
        const { tzOffset } = req.userInfo.user_info;
        const predictions = await predictionsModel.getJoinSpots();
        predictions.map(prediction => {
            return prediction.created_at = DateTime.fromISO(new Date(prediction.created_at)
                .toISOString()).toUTC().plus({ minutes: tzOffset }).toFormat('MMMM dd, tt');
        })

        return res.render('v0/pages/predictions/predictions', { title: 'V0 Prediction Results', predictions });
    } catch (err) {
        console.error(err);
        return res.status(502).json({ message: "internal error" });
    }
});

router.get('/:prediction_id', async function (req, res, next) {
    try {
        const predictions = await predictionsModel.getJoinSpotsById(req.params.prediction_id);
        const next_predictions = await predictionsModel.getByIdGreaterThan(req.params.prediction_id);

        if (predictions.length === 0) {
            return res.status(404).json({ message: 'Prediction stats not found' });
        }
        return res.render('v0/pages/predictions/predictionStat',
            { title: 'V0 Prediction Results', data: predictions[0], next_predictions });
    } catch (err) {
        console.error(err);
        return res.status(502).json({ message: "internal error" });
    }
});

router.put('/:prediction_id', async function(req, res, next){
    try {
        const { prediction_id } = req.params;
        const data = req.body;
        data.is_car = data.is_car === 'car';

        const update_stats = await predictionsModel.updateById(prediction_id, data);

        if (update_stats.status === 'failed') {
            return res.status(502).json({ message: 'Update Failed', payload: update_stats.payload });
        }

        return res.status(200).json({ message: 'Successfully updated prediction stats!' });
    } catch (err) {
        console.error(err);
        return res.status(502).json({ message: "Update failed, internal server error" });
    }
});

module.exports = router;

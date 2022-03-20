const express = require('express');
const router = express.Router();

const predictionsModel = require('../../database/model/predictionsModel');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const predictions = await predictionsModel.getJoinSpots();
        return res.render('v0/pages/predictions/predictions', { title: 'V0 Prediction Results', predictions });
    } catch (err) {
        console.error(err);
        return res.status(502).json({ message: "internal error" });
    }
});

module.exports = router;

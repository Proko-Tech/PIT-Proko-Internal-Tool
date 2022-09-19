var express = require('express');
var router = express.Router();
const {DateTime} = require('luxon');

const defectsModel = require('../database/model/defectsModel');

/* GET / defects page */
router.get('/', async function(req, res, next) {
    const defects = await defectsModel.get();
    const {tzOffset} = req.userInfo.user_info;
    defects.forEach((defect) => {
        defect.created_at = DateTime.fromISO(new Date(defect.created_at)
            .toISOString()).toUTC().plus({minutes: tzOffset})
            .toLocaleString(DateTime.DATETIME_SHORT);
    })
    return res.render('page/defects/defects', {
        title: 'ProkoPark - Defects Table',
        defects,
    });
});

router.get('/:secret_hash', async function(req, res) {
    try {
        const {secret_hash} = req.params;
        const result = await defectsModel.getBySecretHash(secret_hash);
        const {tzOffset} = req.userInfo.user_info;
        result.forEach((defect) => {
            defect.created_at = DateTime.fromISO(new Date(defect.created_at)
                .toISOString()).toUTC().plus({minutes: tzOffset})
                .toLocaleString(DateTime.DATETIME_SHORT);
        })
        if (result.length === 0) {
            return res.status(404).json({msg: 'defect not found'});
        }
        return res.render('page/defects/defect', {
            title: 'Defect',
            defect: result[0],
        })
    } catch (err) {
        return res.status(500).json({msg: 'failed due to internal server error'});
    }
});

router.post('/:secret_hash', async function(req, res) {
    try {
        const {secret_hash} = req.params;
        await defectsModel.updateBySecretHash(secret_hash, {...req.body, status: 'RESOLVED'});
        return res.redirect('/defects/'+secret_hash);
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: 'failed due to internal server error'});
    }
});

router.put('/:secret_hash', async function(req, res) {
    try {
        const {secret_hash} = req.params;
        await defectsModel.updateBySecretHash(secret_hash, {...req.body});
        const result = await defectsModel.getBySecretHash(secret_hash);
        if (result.length === 0) {
            return res.status(404).json({msg: 'defect not found'});
        }
        return res.status(200).json({defect: result[0]});
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: 'failed due to internal server error'});
    }
});

module.exports = router;

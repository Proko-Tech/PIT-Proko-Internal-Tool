var express = require('express');
var router = express.Router();

const defectsModel = require('../database/model/defectsModel');

/* GET / defects page */
router.get('/', async function(req, res, next) {
    const defects = await defectsModel.get();
    console.log(defects);
    res.render('page/defects/defects.ejs', {title:"ProkoPark - Defects Table", defects});
});

module.exports = router;
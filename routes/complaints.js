var express = require('express');
var router = express.Router();

const complaintsModel = require('../database/model/complaintsModel');

require('dotenv').config();

/* GET / complaints page. */
router.get('/', async function(req, res, next) {
    const complaints = await complaintsModel.get();
    res.render('page/complaints/complaints.ejs', {
        title: 'ProkoPark - Complaints Table',
        complaints,
    });
});

/* GET / complaint detail page. */
router.get('/:id', async function(req, res, next) {
    const id = req.params.id;
    const complaints = await complaintsModel.getById(id);
    res.render('page/complaints/complaintDetails.ejs', {
        title: 'ProkoPark - Complaints Detail',
        complaints,
        id,
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var spotModel = require('../database/model/violationsModel');
var tickets_model = require('../database/model/ticketsModel');

/* GET new route */
router.get('/', async function(req, res, next) {
    const id = req.params.id;
    const ticket = await tickets_model.get(id);
    res.render('page/tickets/tickets', {title: 'Tickets', ticket, id});
});

/* GET ticket detail route */
router.get('/:id', async function(req, res, next) {
    const id = '2';
    const spot = await spotModel.ticket_detail_get(id);
    res.render('page/tickets/ticketdetail', {
        title: ' El Fernando Parking - Spot #234',
        spot,
        id,
    });
});

module.exports = router;

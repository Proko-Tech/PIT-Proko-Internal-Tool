var express = require("express");
var router = express.Router();
var spotModel = require('../database/model/violationsModel')
/* GET new route */
router.get('/', async function(req, res, next) {
    res.render('page/tickets/tickets', { title: 'Tickets' });
});

/* GET tickets route */
router.get("/tickets", function(req, res) {
    res.end("/tickets");
});
/* GET ticket detail route */
router.get('/ticket_detail', async function (req,res){
    //const ticketId = req.query()
    // const ticketInfo =  //function call ,{ticketInfo}
    res.render('page/tickets/ticketdetail', {title:" El Fernando Parking - Spot #234"})

});
/* GET ticket detail route */
router.get('/:id', async function(req, res, next) {
    const id = '1';
    const spot = await spotModel.get(id);
    console.log(spot);
    res.render('page/tickets/ticketdetail', {title:" El Fernando Parking - Spot #234", spot, id});
});

module.exports = router;
var express = require("express");
var router = express.Router();

/* GET new route */
router.get('/', async function(req, res, next) {
    res.render('page/tickets/tickets', { title: 'Tickets' });
});

/* GET tickets route */
router.get("/tickets", function(req, res) {
    res.end("/tickets");
});

module.exports = router;
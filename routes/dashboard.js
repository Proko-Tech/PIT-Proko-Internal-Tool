var express = require('express');
var moment = require('moment');
var router = express.Router();
router.get('/', async function(req, res) {
    res.render('page/dashboard/dashboard', {title:"Overview", moment});
});
module.exports = router;

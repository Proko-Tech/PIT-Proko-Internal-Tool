var express = require("express");
var router = express.Router();
router.get('/', async function (req,res){

    res.render('page/dashboard/dashboard', {title:"Overview"})

});
module.exports = router;
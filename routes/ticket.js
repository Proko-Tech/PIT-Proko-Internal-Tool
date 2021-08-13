var express = require('express');
var router = express.Router();
const t = require("../database/model/violationsModel")

router.get('/ticket_detail', async function (req,res){
    //const ticketId = req.query()
   // const ticketInfo =  //function call ,{ticketInfo}
     res.render('page/ticket/ticketdetail')

});

module.exports = router;
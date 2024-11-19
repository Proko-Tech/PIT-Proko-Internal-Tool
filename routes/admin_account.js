var express = require('express');
var router = express.Router();

const adminAccountsModel = require('../database/model/adminAccountsModel.js');
const auth = require('../auth/tokenUtil');
const bcrypt = require('bcrypt-nodejs');

require('dotenv').config();

/* GET / login page. */
router.get('/', async function(req, res, next) {
    try {
        const data = await adminAccountsModel.get();
        res.render('page/admin_account/adminAccounts.ejs',
            {title: 'Admin accounts', data});
    } catch (err) {
        console.error(err);
        res.status(500).json({err});
    }
});

/* POST / route */
router.post('/change_password', async function(req, res) {
    try {
        const password = bcrypt.hashSync(req.body.password, null, null);
        await adminAccountsModel.updateById(
            req.body.id, {admin_password_hash: password});
        res.redirect('/admin_accounts');
    } catch (err) {
        console.error(err);
        res.status(500).json({err});
    }
});


module.exports = router;

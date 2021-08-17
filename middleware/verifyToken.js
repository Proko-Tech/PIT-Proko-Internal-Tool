const tokenUtil = require('../auth/tokenUtil');

async function verifyCookieToken(req, res, next) {
    const user = req.cookies.user;
    if(typeof user !== 'undefined') {
        const tokenInfo = await tokenUtil.validateToken(user);
        req.userInfo = tokenInfo;
        next();
    } else {
        res.redirect('/');
    }
}

module.exports=verifyCookieToken;

const tokenUtil = require('../auth/tokenUtil');

/**
 * Middleware function that validates userToken, and unpacks it into a user object.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
async function verifyCookieToken(req, res, next) {
    const user = req.cookies.user;
    if (typeof user !== 'undefined') {
        const tokenInfo = await tokenUtil.validateToken(user);
        req.userInfo = tokenInfo;
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = verifyCookieToken;

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * insert parking lot using the information given to us
 * @param token
 * @return authData
 */
async function validateToken(token){
    return jwt.verify(token, process.env.TOKENKEY, async function(err, auth_data) {
        if(err) {
            return null;
        } else {
            return auth_data;
        }
    });
}

/**
 * insert parking lot using the information given to us
 * @param user_info
 * @return token
 */
async function generateToken(user_info){
    return jwt.sign({user_info}, process.env.TOKENKEY);
}

module.exports = {
    validateToken,
    generateToken
};

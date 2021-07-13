const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * takes the token and validates the credential stored on the token
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
 * creates a token with the information given to us
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

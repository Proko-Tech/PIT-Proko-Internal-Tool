const db = require('../dbConfig');

/**
 * insert spot hash using the information given to us
 * @param spot_hash
 */
 async function insertSpotHash (spot_hash){
    try {
        await db('spots')
            .insert(spot_hash);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { insertSpotHash };
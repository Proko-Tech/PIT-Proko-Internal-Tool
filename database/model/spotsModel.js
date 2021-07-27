const db = require('../dbConfig');

/**
 * insert spot hash using the information given to us
 * @param spot_id
 * @param spot_hash
 */
 async function insertSpotHash (spot_id, spot_hash){
    try {
        await db('spots')
            .where(spot_id)
            .update(spot_hash);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { insertSpotHash };
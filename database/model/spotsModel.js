const db = require('../dbConfig');

/**
 * update spot hash using the information given to us
 * @param spot_id
 * @param spot_hash
 */
 async function update (spot_id, spot_info){
    try {
        await db('spots')
            .where({ spot_id })
            .update(spot_info);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { update };
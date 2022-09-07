const db = require('../dbConfig');
/**
 * insert lot owners using the information given to us
 * @param lot_owner
 */
async function insert(lot_owner) {
    try {
        await db('lot_ownerships').insert(lot_owner);
    } catch (err) {
        console.log(err);
    }
}
module.exports = {insert};

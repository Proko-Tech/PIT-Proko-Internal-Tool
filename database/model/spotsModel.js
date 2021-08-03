const db = require('../dbConfig');

/**
 * update spot info using the information given to us
 * @param spot_id
 * @param spot_info
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

/**
 * create spots in the spots table
 * @param spot_info
 */
async function create(spot_info){
    try {
        await db('spots')
            .insert(spot_info);
    } catch (err) {
        console.log(err);
    }
}


module.exports = { create, update };
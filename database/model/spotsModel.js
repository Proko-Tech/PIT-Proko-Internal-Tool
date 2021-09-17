const db = require("../dbConfig");
const moment = require('moment');
/**
 * GET for the spots of a specific parking lot by lot_id
 * @param lot_id
 * @returns spots_info
 * 
 * 
 *  */

async function getSpots(lot_id) {
    try {
        let spots = await db('spots')
            .where({ lot_id })
            .select('*');
        spots = await spots.map((row, index) => {
            row.created_at = moment(row.created_at).format('MM-DD-YYYY');
            return row;
        });
        return spots;
    } catch (err) {
        return { err };
    }
}

/**
 * update spot info using the information given to us
 * @param spot_id
 * @param spot_info
 */
async function update(spot_id, spot_info) {
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
async function create(spot_info) {
    try {
        await db('spots')
            .insert(spot_info);
    } catch (err) {
        console.log(err);
    }
}



module.exports = { create, update, getSpots };

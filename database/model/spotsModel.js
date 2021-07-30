const db = require("../dbConfig");

/**
 * GET for the spots of a specific parking lot by lot_id
 * @param lot_id
 * @returns spots_info
 * 
 * 
 *  */

async function getSpots(lot_id) {
    try {
        const spots = await db('spots')
            .where({ lot_id })
            .select('*');
        return spots;
    } catch (err) {
        return { err };
    }
}

module.exports = {getSpots};
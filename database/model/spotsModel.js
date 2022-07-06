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

async function getSpotHashesByLotId(lot_id) {
    try {
        const spots = await getSpots(lot_id);
        const spot_hashes = spots.map((spot) => {
            return spot.secret;
        });
        return spot_hashes;
    } catch (err) {
        return { err };
    }
}

/**
 * update spot info using the information given to us
 * @param String[] spot_hashes
 * @param spot_info
 * @returns {Promise<{status: string}>}
 */
async function update(spot_hashes, spot_info) {
    console.log("spot_hashes", spot_hashes);
    console.log("spot_info", spot_info);
    // Update the spots with the given spot_hashes
    // try {
    //     console.log("Im here")
    //     await db('spots')
    //         .where({'secret': spot_hashes[0]})
    //         .update(spot_info);
    //     return { status: 'success' };
    // } catch (err) {
    //     console.log("Im here too");
    //     return { status: 'failed', payload: err };
    // }
    const result = { status: 'failed' };
    await db.transaction(async (trx) => {
        try {
            console.log("Hash: " + spot_hashes);
            console.log(spot_info);
            for(let i = 0; i < spot_hashes.length; i++) {
                await db('spots')
                    .where({ secret: spot_hashes[i] })
                    .update(spot_info)
                    .transacting(trx);
            }
            await trx.commit();
            result.status = 'success';
        } catch (err) {
            await trx.rollback();
        }
    });

    // try {
    //     await db('spots')
    //         .where({ secret: spot_hash })
    //         .update(spot_info);
    //     return { status: 'success' };
    // } catch (err) {
    //     return { status: 'failed', payload: err };
    // }
    return result;

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



module.exports = { create, update, getSpots, getSpotHashesByLotId };
